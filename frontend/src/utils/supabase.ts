import { createClient } from "@supabase/supabase-js";

// Use VITE_ prefix for Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing. Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
