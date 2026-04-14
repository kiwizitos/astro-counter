import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CowkY7Hv.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BAlhSXM7.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { User, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { n as loginSchema, o as registerSchema, C as Card, b as CardHeader, d as CardTitle, q as CardDescription, e as CardContent, B as Button, L as Label, I as Input, s as supabase } from '../chunks/card_ClVp_5rl.mjs';
export { renderers } from '../renderers.mjs';

function AuthForm() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loginForm = useForm({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm({ resolver: zodResolver(registerSchema) });
  const currentForm = mode === "login" ? loginForm : registerForm;
  async function handleLogin(data) {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });
    setIsLoading(false);
    if (error) {
      if (error.message.includes("Invalid login credentials") || error.message.includes("invalid_credentials")) {
        toast.error("Email ou senha incorretos.");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Confirme seu email antes de entrar. Verifique sua caixa de entrada.");
      } else {
        toast.error(error.message ?? "Erro ao fazer login.");
      }
      return;
    }
    toast.success("Login realizado! Redirecionando...");
    window.location.href = "/dashboard";
  }
  async function handleRegister(data) {
    setIsLoading(true);
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    setIsLoading(false);
    if (error) {
      if (error.message.includes("User already registered")) {
        toast.error("Este email já está cadastrado. Tente fazer login.");
      } else if (error.message.includes("Password should be")) {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
      } else if (error.message.includes("Invalid email")) {
        toast.error("Email inválido.");
      } else {
        toast.error(error.message ?? "Erro ao criar conta.");
      }
      return;
    }
    if (authData.session) {
      toast.success("Conta criada com sucesso! Redirecionando...");
      window.location.href = "/dashboard";
      return;
    }
    toast.success(
      "Conta criada! Verifique seu email para confirmar o cadastro antes de entrar.",
      { duration: 8e3 }
    );
    setMode("login");
  }
  async function handleGoogleLogin() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }
  function onSubmit(data) {
    if (mode === "login") {
      void handleLogin(data);
    } else {
      void handleRegister(data);
    }
  }
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md mx-auto shadow-xl animate-fade-in", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "space-y-1 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx("span", { className: "text-2xl", children: "🔢" }) }),
      /* @__PURE__ */ jsx(CardTitle, { className: "text-2xl font-bold", children: mode === "login" ? "Bem-vindo de volta!" : "Criar conta" }),
      /* @__PURE__ */ jsx(CardDescription, { children: mode === "login" ? "Entre para acessar seus grupos e contadores" : "Comece a contar junto com seus amigos" })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "w-full gap-2",
          onClick: handleGoogleLogin,
          disabled: isLoading,
          children: [
            /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 24 24", className: "h-4 w-4", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                  fill: "#4285F4"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                  fill: "#34A853"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                  fill: "#FBBC05"
                }
              ),
              /* @__PURE__ */ jsx(
                "path",
                {
                  d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                  fill: "#EA4335"
                }
              )
            ] }),
            "Continuar com Google"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t" }) }),
        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx("span", { className: "bg-card px-2 text-muted-foreground", children: "ou" }) })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: mode === "login" ? loginForm.handleSubmit((d) => onSubmit(d)) : registerForm.handleSubmit((d) => onSubmit(d)),
          className: "space-y-3",
          children: [
            mode === "register" && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "full_name", children: "Nome completo" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "full_name",
                    placeholder: "Seu nome",
                    className: "pl-9",
                    ...registerForm.register("full_name")
                  }
                )
              ] }),
              registerForm.formState.errors.full_name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: registerForm.formState.errors.full_name.message })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "email",
                    type: "email",
                    placeholder: "seu@email.com",
                    className: "pl-9",
                    ...currentForm.register("email")
                  }
                )
              ] }),
              currentForm.formState.errors.email && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: currentForm.formState.errors.email.message })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "password", children: "Senha" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "password",
                    type: showPassword ? "text" : "password",
                    placeholder: "••••••••",
                    className: "pl-9 pr-9",
                    ...currentForm.register("password")
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPassword((v) => !v),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                    children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] }),
              currentForm.formState.errors.password && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: currentForm.formState.errors.password.message })
            ] }),
            mode === "register" && /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPassword", children: "Confirmar senha" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "confirmPassword",
                    type: showPassword ? "text" : "password",
                    placeholder: "••••••••",
                    className: "pl-9",
                    ...registerForm.register("confirmPassword")
                  }
                )
              ] }),
              registerForm.formState.errors.confirmPassword && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: registerForm.formState.errors.confirmPassword.message })
            ] }),
            /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : mode === "login" ? "Entrar" : "Criar conta" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-muted-foreground", children: [
        mode === "login" ? "Não tem conta?" : "Já tem conta?",
        " ",
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setMode(mode === "login" ? "register" : "login"),
            className: "text-primary hover:underline font-medium",
            children: mode === "login" ? "Criar conta" : "Fazer login"
          }
        )
      ] })
    ] })
  ] });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Entrar" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex min-h-screen items-center justify-center p-4"> <div class="w-full max-w-md"> ${renderComponent($$result2, "AuthForm", AuthForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/AuthForm", "client:component-export": "default" })} </div> </div> ` })}`;
}, "C:/Users/Matheus/Documents/Counter/src/pages/login.astro", void 0);

const $$file = "C:/Users/Matheus/Documents/Counter/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
