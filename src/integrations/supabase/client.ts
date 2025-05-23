
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzkegmjhbwtpocxigtgm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6a2VnbWpoYnd0cG9jeGlndGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyOTExMjUsImV4cCI6MjA1ODg2NzEyNX0.G0yXVeJaFrWmeANsIXgPdKKZKoznZEt7YEuoulmsmGA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: true
  }
});

// Helper function to get the current user profile from the users table
export const getUserProfile = async (userId: string | undefined) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

// Create a type-safe helper function to get user by auth_id
export const getUserByAuthId = async (authId: string | undefined) => {
  if (!authId) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .single();
  
  if (error) {
    console.error('Error fetching user by auth_id:', error);
    return null;
  }
  
  return data;
};
