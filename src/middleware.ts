/**
 * Astro middleware — roda em toda request antes da página renderizar.
 * Protege rotas autenticadas e injeta o usuário atual nos locals.
 */
import type { MiddlewareHandler } from 'astro';
import { createServerClient } from '@/lib/supabaseServer';

/** Rotas que exigem usuário autenticado */
const PROTECTED_ROUTES = ['/dashboard', '/groups'];

/** Rotas apenas para usuários não autenticados */
const AUTH_ROUTES = ['/login'];

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { request, redirect, locals } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Cria cliente SSR — lê sessão dos cookies do request
  const { supabase, responseHeaders } = createServerClient(request);

  // Tenta obter a sessão atual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Injeta nos locals para as páginas usarem sem re-fetch
  locals.user = user ?? null;
  locals.session = user ? ({ user } as App.Locals['session']) : null;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route));

  // Redireciona não-autenticados fora de rotas protegidas
  if (isProtected && !user) {
    return redirect(`/login?redirect=${encodeURIComponent(path)}`);
  }

  // Redireciona autenticados fora de rotas de auth
  if (isAuthRoute && user) {
    return redirect('/dashboard');
  }

  // Continua a request e propaga quaisquer Set-Cookie da sessão
  const response = await next();

  // Copia headers de Set-Cookie que o Supabase precisar escrever (refresh de token, etc.)
  responseHeaders.forEach((value, key) => {
    response.headers.append(key, value);
  });

  return response;
};
