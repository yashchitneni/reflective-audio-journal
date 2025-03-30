import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, JournalEntry, CalendarEvent, Prompt } from '@/types/models';

// Generic hook for fetching user data safely
export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data as UserProfile);
      } catch (e) {
        console.error('Error fetching user profile:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
}

// Hook for fetching journal entries
export function useJournalEntries(limit: number = 5) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchEntries() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // First get the user's profile to get their internal ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userError) throw userError;
        
        if (!userData) {
          throw new Error('User profile not found');
        }
        
        // Get the total count of entries for this user
        const { count, error: countError } = await supabase
          .from('journal_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userData.id);
          
        if (countError) throw countError;
        setTotalCount(count || 0);
        
        // Then get the journal entries
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userData.id)
          .order('entry_date', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setEntries(data as JournalEntry[]);
      } catch (e) {
        console.error('Error fetching journal entries:', e);
        setError(e as Error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [user, limit]);

  return { entries, totalCount, loading, error };
}

// Hook for fetching calendar events
export function useCalendarEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // First get the user's profile to get their internal ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userError) throw userError;
        
        // Then get the calendar events
        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', userData.id)
          .order('start_time', { ascending: true });

        if (error) throw error;
        setEvents(data as CalendarEvent[]);
      } catch (e) {
        console.error('Error fetching calendar events:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [user]);

  return { events, loading, error };
}

// Hook for fetching prompts
export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPrompts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('prompts')
          .select('*');

        if (error) throw error;
        setPrompts(data as Prompt[]);
      } catch (e) {
        console.error('Error fetching prompts:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrompts();
  }, []);

  return { prompts, loading, error };
}

// New hook for fetching a single journal entry
export function useJournalEntry(entryId: string | undefined) {
  const { user } = useAuth();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchEntry() {
      if (!user?.id || !entryId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First get the user's profile to get their internal ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userError) throw userError;
        
        if (!userData) {
          throw new Error('User profile not found');
        }

        // Then get the specific journal entry
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userData.id)
          .eq('id', entryId)
          .single();

        if (error) throw error;
        
        setEntry(data as JournalEntry);
      } catch (e) {
        console.error('Error fetching journal entry:', e);
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntry();
  }, [user, entryId]);

  return { entry, loading, error };
}
