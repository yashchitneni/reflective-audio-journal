
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0';

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://zzkegmjhbwtpocxigtgm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Create a Supabase client with the service role key for admin operations
const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper function to refresh an access token if expired
async function refreshTokenIfNeeded(userId: string, tokenData: any) {
  // Check if token is expired or about to expire (within 5 minutes)
  const expiryDate = new Date(tokenData.expiry_date);
  const now = new Date();
  const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
  
  if (expiryDate <= fiveMinutesFromNow) {
    console.log('Token expired or expiring soon, refreshing...');
    
    try {
      const tokenUrl = 'https://oauth2.googleapis.com/token';
      const params = new URLSearchParams({
        client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
        client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
        refresh_token: tokenData.refresh_token,
        grant_type: 'refresh_token',
      });

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error refreshing token:', data);
        throw new Error(data.error_description || 'Failed to refresh token');
      }
      
      // Update token data with new access token and expiry
      const updatedTokenData = {
        ...tokenData,
        access_token: data.access_token,
        expiry_date: new Date(now.getTime() + (data.expires_in * 1000)).toISOString(),
      };
      
      // Store updated token in database
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          calendar_token: updatedTokenData,
          updated_at: new Date().toISOString(),
        })
        .eq('auth_id', userId);
      
      if (error) {
        console.error('Error updating token in database:', error);
        throw error;
      }
      
      return updatedTokenData;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  return tokenData;
}

// Fetch events from Google Calendar
async function fetchCalendarEvents(accessToken: string, pageToken?: string) {
  // Set up parameters for the Google Calendar API request
  const timeMin = new Date();
  timeMin.setDate(timeMin.getDate() - 30); // Fetch events from 30 days ago
  
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 90); // Fetch events up to 90 days in the future
  
  // Build the API URL
  let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
  url += `?timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}`;
  url += '&singleEvents=true&orderBy=startTime';
  
  // Add page token if it exists
  if (pageToken) {
    url += `&pageToken=${pageToken}`;
  }
  
  // Make the API request
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Error fetching calendar events:', error);
    throw new Error(error.message || 'Failed to fetch calendar events');
  }
  
  return response.json();
}

// Save calendar events to the database
async function saveCalendarEvents(userId: string, events: any[]) {
  try {
    // First get the user's database ID using their auth ID
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('auth_id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user ID:', userError);
      throw userError;
    }
    
    const dbUserId = userData.id;
    
    // Process each event
    for (const event of events) {
      // Skip events without start or end times
      if (!event.start || !event.end) {
        continue;
      }
      
      // Handle all-day events vs. time-specific events
      const startTime = event.start.dateTime || `${event.start.date}T00:00:00Z`;
      const endTime = event.end.dateTime || `${event.end.date}T23:59:59Z`;
      
      // Check if the event already exists
      const { data: existingEvents, error: checkError } = await supabaseAdmin
        .from('calendar_events')
        .select('id')
        .eq('user_id', dbUserId)
        .eq('external_event_id', event.id);
      
      if (checkError) {
        console.error('Error checking for existing event:', checkError);
        continue; // Skip this event but continue with others
      }
      
      if (existingEvents && existingEvents.length > 0) {
        // Update existing event
        const { error: updateError } = await supabaseAdmin
          .from('calendar_events')
          .update({
            event_title: event.summary || 'Untitled Event',
            event_description: event.description || null,
            start_time: startTime,
            end_time: endTime,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingEvents[0].id);
        
        if (updateError) {
          console.error('Error updating event:', updateError);
        }
      } else {
        // Insert new event
        const { error: insertError } = await supabaseAdmin
          .from('calendar_events')
          .insert({
            user_id: dbUserId,
            external_event_id: event.id,
            event_title: event.summary || 'Untitled Event',
            event_description: event.description || null,
            start_time: startTime,
            end_time: endTime,
          });
        
        if (insertError) {
          console.error('Error inserting event:', insertError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in saveCalendarEvents:', error);
    throw error;
  }
}

// Extract the user ID from the authorization header
function getUserId(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    return null;
  }
  
  try {
    // Parse the JWT to get the user ID
    const token = authHeader.replace('Bearer ', '');
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
}

// Handle the HTTP request
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  try {
    const userId = getUserId(req);
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get user's calendar token
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('calendar_token')
      .eq('auth_id', userId)
      .single();
    
    if (userError || !userData?.calendar_token) {
      return new Response(
        JSON.stringify({ error: 'No connected calendar found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Refresh token if needed
    const tokenData = await refreshTokenIfNeeded(userId, userData.calendar_token);
    
    // Fetch and save events
    let pageToken;
    let allEvents = [];
    
    do {
      // Fetch a page of events
      const calendarData = await fetchCalendarEvents(tokenData.access_token, pageToken);
      
      // Add events to our collection
      if (calendarData.items && calendarData.items.length > 0) {
        allEvents = [...allEvents, ...calendarData.items];
      }
      
      // Get the next page token if it exists
      pageToken = calendarData.nextPageToken;
    } while (pageToken);
    
    // Save events to the database
    await saveCalendarEvents(userId, allEvents);
    
    // Update last sync time
    await supabaseAdmin
      .from('users')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('auth_id', userId);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully synced ${allEvents.length} events` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing calendar events:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to sync calendar events' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
