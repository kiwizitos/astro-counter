import { createServerClient as createServerClient$1 } from '@supabase/ssr';

function createServerClient(request) {
  const supabaseUrl = "https://rnnhdzsktrbbopodlqis.supabase.co";
  const supabaseAnonKey = "sb_publishable_9lx0iiKAc0HSuqs4ghevZQ_vo4ceOV1";
  const cookieHeader = request.headers.get("cookie") ?? "";
  const parsedCookies = parseCookieHeader(cookieHeader);
  const responseHeaders = new Headers();
  const supabase = createServerClient$1(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parsedCookies;
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          const cookieStr = serializeCookie(name, value, options);
          responseHeaders.append("Set-Cookie", cookieStr);
        });
      }
    }
  });
  return { supabase, responseHeaders };
}
function parseCookieHeader(header) {
  if (!header) return [];
  return header.split(";").map((pair) => {
    const idx = pair.indexOf("=");
    return {
      name: pair.slice(0, idx).trim(),
      value: pair.slice(idx + 1).trim()
    };
  });
}
function serializeCookie(name, value, options = {}) {
  let str = `${name}=${encodeURIComponent(value)}`;
  if (options.maxAge) str += `; Max-Age=${options.maxAge}`;
  if (options.domain) str += `; Domain=${options.domain}`;
  if (options.path ?? true) str += `; Path=${options.path ?? "/"}`;
  if (options.expires instanceof Date) str += `; Expires=${options.expires.toUTCString()}`;
  if (options.httpOnly) str += "; HttpOnly";
  if (options.secure) str += "; Secure";
  if (options.sameSite) str += `; SameSite=${options.sameSite}`;
  return str;
}

export { createServerClient as c };
