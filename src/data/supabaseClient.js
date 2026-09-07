import { createClient } from '@supabase/supabase-js';

// Read configuration from Vite environment variables or localStorage override
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('marye_supabase_url') || '' : '';
const storedAnonKey = typeof window !== 'undefined' ? localStorage.getItem('marye_supabase_anon_key') || '' : '';

const supabaseUrl = storedUrl || envUrl;
const supabaseAnonKey = storedAnonKey || envAnonKey;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export function updateSupabaseConfig(url, anonKey) {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem('marye_supabase_url', url);
      localStorage.setItem('marye_supabase_anon_key', anonKey);
    } else {
      localStorage.removeItem('marye_supabase_url');
      localStorage.removeItem('marye_supabase_anon_key');
    }
  }
}

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isConfigured: isSupabaseConfigured,
  };
}
