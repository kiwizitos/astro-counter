import { c as createServerClient } from './chunks/supabaseServer_1oW6kvE0.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_pJO34LDA.mjs';
import 'piccolore';
import './chunks/astro/server_CowkY7Hv.mjs';
import 'clsx';
import { s as sequence } from './chunks/index_CW30Y62o.mjs';

const PROTECTED_ROUTES = ["/dashboard", "/groups"];
const AUTH_ROUTES = ["/login"];
const onRequest$1 = async (context, next) => {
  const { request, redirect, locals } = context;
  const url = new URL(request.url);
  const path = url.pathname;
  const { supabase, responseHeaders } = createServerClient(request);
  const {
    data: { user }
  } = await supabase.auth.getUser();
  locals.user = user ?? null;
  locals.session = user ? { user } : null;
  const isProtected = PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => path.startsWith(route));
  if (isProtected && !user) {
    return redirect(`/login?redirect=${encodeURIComponent(path)}`);
  }
  if (isAuthRoute && user) {
    return redirect("/dashboard");
  }
  const response = await next();
  responseHeaders.forEach((value, key) => {
    response.headers.append(key, value);
  });
  return response;
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
