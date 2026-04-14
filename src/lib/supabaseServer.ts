/**
 * Supabase server client — para páginas SSR do Astro e middleware.
 * Usa @supabase/ssr para ler/escrever cookies corretamente no servidor.
 * NUNCA importe este arquivo em islands/componentes client-side.
 */
import { createServerClient as createSupabaseServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Cria um cliente Supabase server-side lendo cookies do header da request.
 * Retorna o cliente e um array de Set-Cookie headers para aplicar na response.
 */
export function createServerClient(request: Request) {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars for server client.');
  }

  // Cookies vindos do request (string "name=value; name2=value2")
  const cookieHeader = request.headers.get('cookie') ?? '';
  const parsedCookies = parseCookieHeader(cookieHeader);

  // Headers de Set-Cookie que serão coletados para aplicar na response
  const responseHeaders = new Headers();

  const supabase = createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parsedCookies;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieStr = serializeCookie(name, value, options);
          responseHeaders.append('Set-Cookie', cookieStr);
        });
      },
    },
  });

  return { supabase, responseHeaders };
}

/** Parseia o header Cookie em array de { name, value } */
function parseCookieHeader(header: string): { name: string; value: string }[] {
  if (!header) return [];
  return header.split(';').map((pair) => {
    const idx = pair.indexOf('=');
    return {
      name: pair.slice(0, idx).trim(),
      value: pair.slice(idx + 1).trim(),
    };
  });
}

/** Serializa um cookie para o header Set-Cookie */
function serializeCookie(
  name: string,
  value: string,
  options: Record<string, unknown> = {}
): string {
  let str = `${name}=${encodeURIComponent(value)}`;
  if (options.maxAge) str += `; Max-Age=${options.maxAge}`;
  if (options.domain) str += `; Domain=${options.domain}`;
  if (options.path ?? true) str += `; Path=${options.path ?? '/'}`;
  if (options.expires instanceof Date) str += `; Expires=${options.expires.toUTCString()}`;
  if (options.httpOnly) str += '; HttpOnly';
  if (options.secure) str += '; Secure';
  if (options.sameSite) str += `; SameSite=${options.sameSite}`;
  return str;
}

/**
 * Admin client — usa service role (bypassa RLS).
 * Apenas para operações privilegiadas no servidor.
 */
export function createAdminClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing service role env vars for admin client.');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
