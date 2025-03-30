
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useGoogleCalendar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Start the OAuth flow to connect Google Calendar
  const connectCalendar = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to connect your calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Call our edge function to get the authorization URL
      const { data, error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'authorize' }
      });
      
      if (error) {
        throw error;
      }
      
      // Add the user ID as state parameter
      const authUrl = new URL(data.url);
      authUrl.searchParams.append('state', user.id);
      
      // Redirect to Google's authorization page
      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to Google Calendar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect Google Calendar
  const disconnectCalendar = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to disconnect your calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Call our edge function to revoke access and clean up
      const { error } = await supabase.functions.invoke('google-calendar-auth', {
        body: { action: 'disconnect' }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Calendar disconnected",
        description: "Your Google Calendar has been disconnected."
      });
      
      // Force a page refresh to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error disconnecting Google Calendar:', error);
      toast({
        title: "Disconnection failed",
        description: error.message || "Failed to disconnect from Google Calendar.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sync calendar events
  const syncCalendarEvents = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to sync your calendar.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSyncing(true);
      
      // Call our edge function to sync events
      const { data, error } = await supabase.functions.invoke('sync-calendar-events', {});
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Calendar synced",
        description: data.message || "Your calendar events have been synced."
      });
    } catch (error) {
      console.error('Error syncing calendar events:', error);
      toast({
        title: "Sync failed",
        description: error.message || "Failed to sync your calendar events.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    connectCalendar,
    disconnectCalendar,
    syncCalendarEvents,
    isLoading,
    isSyncing,
  };
}
