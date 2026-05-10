const requiredEnvEntries = [
  ['VITE_BACKEND_URL', import.meta.env.VITE_BACKEND_URL],
  ['VITE_GOOGLE_CLIENT_ID', import.meta.env.VITE_GOOGLE_CLIENT_ID],
  ['VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL],
  ['VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY],
] as const;

const missing = requiredEnvEntries.filter(([, value]) => !value).map(([key]) => key);

if (missing.length > 0) {
  throw new Error(`Missing required frontend environment variables: ${missing.join(', ')}`);
}

export const env = {
  backendUrl: import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ''),
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};
