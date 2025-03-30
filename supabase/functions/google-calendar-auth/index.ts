
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0';

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google OAuth configuration
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET');
const REDIRECT_URI = Deno.env.get('REDIRECT_URI') || 'https://zzkegmjhbwtpocxigtgm.supabase.co/functions/v1/google-calendar-auth';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || 'https://zzkegmjhbwtpocxigtgm.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173';

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

// Helper function to create the OAuth authorization URL
function getAuthorizationUrl() {
  const scopes = ['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/calendar.events.readonly'];
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  authUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID!);
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI!);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', scopes.join(' '));
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('prompt', 'consent'); // Force to get refresh token
  
  return authUrl.toString();
}

// Exchange authorization code for tokens
async function exchangeCodeForTokens(code: string) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    client_secret: GOOGLE_CLIENT_SECRET!,
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI!,
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
    console.error('Error exchanging code for token:', data);
    throw new Error(data.error_description || 'Failed to exchange authorization code');
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expiry_date: new Date(Date.now() + (data.expires_in * 1000)).toISOString(),
    token_type: data.token_type,
  };
}

// Store tokens in the database
async function storeTokens(userId: string, tokenData: any) {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({
        calendar_token: tokenData,
        updated_at: new Date().toISOString()
      })
      .eq('auth_id', userId);

    if (error) {
      console.error('Error storing tokens:', error);
      throw error;
    }
    
    console.log('Successfully stored tokens for user:', userId);
  } catch (error) {
    console.error('Error in storeTokens:', error);
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

// Refresh an expired access token
async function refreshAccessToken(refreshToken: string) {
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    client_secret: GOOGLE_CLIENT_SECRET!,
    refresh_token: refreshToken,
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

  return {
    access_token: data.access_token,
    expiry_date: new Date(Date.now() + (data.expires_in * 1000)).toISOString(),
    token_type: data.token_type,
  };
}

// Revoke access to Google Calendar
async function revokeAccess(accessToken: string) {
  const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${accessToken}`;
  
  const response = await fetch(revokeUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  if (!response.ok) {
    const data = await response.json();
    console.error('Error revoking token:', data);
    throw new Error(data.error_description || 'Failed to revoke token');
  }
  
  return true;
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

  // Get URL parameters
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  
  try {
    // Generate authorization URL
    if (action === 'authorize') {
      const authUrl = getAuthorizationUrl();
      return new Response(JSON.stringify({ url: authUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Handle OAuth callback
    if (action === 'callback') {
      const code = url.searchParams.get('code');
      const userId = url.searchParams.get('state');
      
      if (!code || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing code or user ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const tokenData = await exchangeCodeForTokens(code);
      await storeTokens(userId, tokenData);
      
      // Redirect back to the frontend with success
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': `${FRONTEND_URL}/profile?calendarConnected=true`,
        },
      });
    }
    
    // Disconnect Google Calendar
    if (action === 'disconnect') {
      const userId = getUserId(req);
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'Authentication required' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Get user's access token
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('calendar_token')
        .eq('auth_id', userId)
        .single();
      
      if (userError || !userData?.calendar_token?.access_token) {
        return new Response(
          JSON.stringify({ error: 'No connected calendar found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Revoke access token
      await revokeAccess(userData.calendar_token.access_token);
      
      // Remove token from database
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          calendar_token: null,
          updated_at: new Date().toISOString()
        })
        .eq('auth_id', userId);
      
      if (updateError) {
        return new Response(
          JSON.stringify({ error: 'Failed to update user record' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Invalid action
    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
