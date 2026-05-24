import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';

function normalizeSupabaseUrl(rawUrl: string) {
  const trimmedUrl = rawUrl.trim();

  try {
    const parsedUrl = new URL(trimmedUrl);

    if (parsedUrl.protocol === 'http:' && parsedUrl.hostname !== 'localhost' && parsedUrl.hostname !== '127.0.0.1') {
      parsedUrl.protocol = 'https:';
    }

    return parsedUrl.toString().replace(/\/$/, '');
  } catch {
    return trimmedUrl.replace(/^http:\/\//, 'https://');
  }
}

const supabaseUrl = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type { Session, User } from '@supabase/supabase-js';

