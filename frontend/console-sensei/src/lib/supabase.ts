import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

/**
 * Reliably gets the current user's JWT access token.
 * Automatically refreshes the session if expired.
 * Throws if the user is not authenticated.
 */
export async function getAuthToken(): Promise<string> {
  // First try current session
  let { data: { session }, error } = await supabase.auth.getSession();
  
  // If no session, try refreshing
  if (!session) {
    const refreshResult = await supabase.auth.refreshSession();
    session = refreshResult.data.session;
  }
  
  if (!session?.access_token) {
    throw new Error('Not authenticated. Please log in again.');
  }
  
  return session.access_token;
}
