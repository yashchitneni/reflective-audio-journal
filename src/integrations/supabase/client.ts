
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zzkegmjhbwtpocxigtgm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6a2VnbWpoYnd0cG9jeGlndGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyOTExMjUsImV4cCI6MjA1ODg2NzEyNX0.G0yXVeJaFrWmeANsIXgPdKKZKoznZEt7YEuoulmsmGA";

// This helps track the current window URL for proper redirects
const getRedirectTo = () => {
  // Get base URL (e.g. http://localhost:3000 or https://myapp.com)
  const baseUrl = window.location.origin;
  return `${baseUrl}/dashboard`;
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
  }
});
