/**
 * Supabase client para o browser (islands / client-side).
 * Usa @supabase/ssr para garantir que a sessão seja persistida em cookies
 * (e não apenas em localStorage), permitindo que o servidor leia a sessão.
 */
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env vars. Check PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env'
  );
}

/**
 * Singleton browser client — reutilize em todos os islands.
 * createBrowserClient persiste a sessão em cookies (não localStorage),
 * então o middleware do Astro consegue ler a sessão no servidor.
 */
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

export type SupabaseClient = typeof supabase;
