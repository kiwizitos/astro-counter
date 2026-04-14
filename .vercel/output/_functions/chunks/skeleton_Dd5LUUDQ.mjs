import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, l as renderSlot } from './astro/server_CowkY7Hv.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from './BaseLayout_BAlhSXM7.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, User, LogOut, LayoutDashboard, Users, X } from 'lucide-react';
import { toast } from 'sonner';
import { c as cn, g as getInitials, s as supabase, p as parseError } from './card_ClVp_5rl.mjs';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { useQuery, useQueryClient, useMutation, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const Avatar = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Root,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = AvatarPrimitive.Root.displayName;
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Image,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AvatarPrimitive.Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

function AppHeader({ userEmail, userName, userAvatar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);
  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair.");
      setSigningOut(false);
      return;
    }
    window.location.href = "/login";
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: /* @__PURE__ */ jsxs("div", { className: "container max-w-2xl px-4 flex h-14 items-center justify-between", children: [
      /* @__PURE__ */ jsxs("a", { href: "/dashboard", className: "flex items-center gap-2 font-bold text-lg", children: [
        /* @__PURE__ */ jsx("span", { className: "text-2xl", role: "img", "aria-label": "contador", children: "🔢" }),
        /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Contador Coletivo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setMenuOpen((v) => !v),
            className: "flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-accent transition-colors",
            "aria-label": "Menu do usuário",
            children: [
              /* @__PURE__ */ jsxs(Avatar, { className: "h-7 w-7", children: [
                /* @__PURE__ */ jsx(AvatarImage, { src: userAvatar ?? void 0 }),
                /* @__PURE__ */ jsx(AvatarFallback, { className: "text-xs", children: getInitials(userName ?? userEmail) })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:block text-sm font-medium max-w-[120px] truncate", children: userName ?? userEmail }),
              /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground" })
            ]
          }
        ),
        menuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "fixed inset-0 z-10",
              onClick: () => setMenuOpen(false),
              "aria-hidden": true
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border bg-popover shadow-lg p-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 border-b mb-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs font-medium truncate", children: userName ?? "Usuário" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: userEmail })
            ] }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/profile",
                className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors",
                onClick: () => setMenuOpen(false),
                children: [
                  /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
                  "Perfil"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleSignOut,
                disabled: signingOut,
                className: "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50",
                children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }),
                  signingOut ? "Saindo…" : "Sair"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset-bottom", children: /* @__PURE__ */ jsxs("div", { className: "flex h-16 items-center justify-around max-w-2xl mx-auto px-4", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/dashboard",
          className: `flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs transition-colors ${currentPath === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsx("span", { children: "Dashboard" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/groups",
          className: `flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-xs transition-colors ${currentPath.startsWith("/groups") ? "text-primary" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsx("span", { children: "Grupos" })
          ]
        }
      )
    ] }) })
  ] });
}

const $$Astro = createAstro();
const $$AppLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AppLayout;
  const { title } = Astro2.props;
  const { user } = Astro2.locals;
  const userName = user?.user_metadata?.full_name ?? null;
  const userEmail = user?.email ?? null;
  const userAvatar = user?.user_metadata?.avatar_url ?? null;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": title }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "AppHeader", AppHeader, { "userEmail": userEmail, "userName": userName, "userAvatar": userAvatar, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Matheus/Documents/Counter/src/components/layout/AppHeader", "client:component-export": "default" })} ${maybeRenderHead()}<main class="mx-auto w-full max-w-2xl px-4 py-5 pb-24 min-h-[calc(100vh-3.5rem)]"> ${renderSlot($$result2, $$slots["default"])} </main> ` })}`;
}, "C:/Users/Matheus/Documents/Counter/src/components/layout/AppLayout.astro", void 0);

const queryKeys = {
  profile: (userId) => ["profile", userId],
  groups: (userId) => ["groups", userId],
  group: (groupId) => ["group", groupId],
  groupMembers: (groupId) => ["groupMembers", groupId],
  counters: (groupId) => ["counters", groupId],
  counter: (counterId) => ["counter", counterId],
  logs: (counterId) => ["logs", counterId],
  leaderboard: (counterId) => ["leaderboard", counterId]
};
function useGroups(userId) {
  return useQuery({
    queryKey: userId ? queryKeys.groups(userId) : ["groups", "none"],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("group_members").select("groups(*)").eq("user_id", userId);
      if (error) throw error;
      return (data ?? []).map((m) => m.groups);
    }
  });
}
function useGroupMembers(groupId) {
  return useQuery({
    queryKey: groupId ? queryKeys.groupMembers(groupId) : ["groupMembers", "none"],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase.from("group_members").select("*, profiles(*)").eq("group_id", groupId);
      if (error) throw error;
      return data ?? [];
    }
  });
}
function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data: sessionData } = await supabase.auth.getUser();
      const authUser = sessionData?.user;
      if (!authUser) throw new Error("Você precisa estar autenticado para criar um grupo.");
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: input.userId,
          full_name: authUser.user_metadata?.full_name ?? null,
          avatar_url: authUser.user_metadata?.avatar_url ?? null
        },
        { onConflict: "id", ignoreDuplicates: true }
      );
      if (profileError) throw new Error(`Erro ao sincronizar perfil: ${parseError(profileError)}`);
      const { data: group, error: groupError } = await supabase.from("groups").insert({ name: input.name, description: input.description, owner_id: input.userId }).select().single();
      if (groupError) throw new Error(`Erro ao criar grupo: ${parseError(groupError)}`);
      const { error: memberError } = await supabase.from("group_members").insert({ group_id: group.id, user_id: input.userId, role: "owner" });
      if (memberError) throw new Error(`Erro ao adicionar membro: ${parseError(memberError)}`);
      return group;
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: queryKeys.groups(variables.userId) });
    }
  });
}
function useJoinGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data: group, error: findError } = await supabase.from("groups").select("*").eq("invite_code", input.inviteCode.toUpperCase()).single();
      if (findError) throw new Error("Código de convite inválido.");
      const { data: existing } = await supabase.from("group_members").select("id").eq("group_id", group.id).eq("user_id", input.userId).maybeSingle();
      if (existing) throw new Error("Você já é membro deste grupo.");
      const { error: joinError } = await supabase.from("group_members").insert({ group_id: group.id, user_id: input.userId, role: "member" });
      if (joinError) throw joinError;
      return group;
    },
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: queryKeys.groups(variables.userId) });
    }
  });
}
function useCounters(groupId) {
  return useQuery({
    queryKey: groupId ? queryKeys.counters(groupId) : ["counters", "none"],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase.from("counters").select("*").eq("group_id", groupId).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    }
  });
}
function useCreateCounter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data, error } = await supabase.from("counters").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.counters(data.group_id) });
    }
  });
}
function useLogs(counterId) {
  return useQuery({
    queryKey: counterId ? queryKeys.logs(counterId) : ["logs", "none"],
    enabled: !!counterId,
    queryFn: async () => {
      const { data, error } = await supabase.from("counter_logs").select("*, profiles(id, full_name, username, avatar_url)").eq("counter_id", counterId).order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data ?? [];
    }
  });
}
function useAddLog() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const { data, error } = await supabase.from("counter_logs").insert({
        counter_id: input.counter_id,
        user_id: input.user_id,
        amount: input.amount,
        note: input.note ?? null
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: queryKeys.logs(data.counter_id) });
      void qc.invalidateQueries({ queryKey: queryKeys.counter(data.counter_id) });
      void qc.invalidateQueries({ queryKey: queryKeys.leaderboard(data.counter_id) });
    }
  });
}
function useLeaderboard(counterId) {
  return useQuery({
    queryKey: counterId ? queryKeys.leaderboard(counterId) : ["leaderboard", "none"],
    enabled: !!counterId,
    queryFn: async () => {
      const { data, error } = await supabase.from("counter_logs").select("user_id, amount, profiles(full_name, username, avatar_url)").eq("counter_id", counterId);
      if (error) throw error;
      const map = /* @__PURE__ */ new Map();
      for (const row of data ?? []) {
        const uid = row.user_id;
        const profile = row.profiles;
        const existing = map.get(uid);
        if (existing) {
          existing.total_amount += row.amount;
        } else {
          map.set(uid, {
            user_id: uid,
            counter_id: counterId,
            total_amount: row.amount,
            full_name: profile?.full_name ?? null,
            username: profile?.username ?? null,
            avatar_url: profile?.avatar_url ?? null
          });
        }
      }
      return Array.from(map.values()).sort((a, b) => b.total_amount - a.total_amount);
    }
  });
}

const defaultOptions = {
  queries: {
    staleTime: 30 * 1e3,
    // 30s
    gcTime: 5 * 60 * 1e3,
    // 5m
    retry: 1,
    refetchOnWindowFocus: false
  }
};
function withQueryProvider(Component) {
  function WrappedWithQuery(props) {
    const [queryClient] = useState(() => new QueryClient({ defaultOptions }));
    return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Component, { ...props }) });
  }
  WrappedWithQuery.displayName = `withQueryProvider(${Component.displayName ?? Component.name})`;
  return WrappedWithQuery;
}

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      // Overlay cobre tudo E centraliza o modal via flexbox —
      // assim não dependemos de translate no modal, evitando bugs com containing blocks
      "fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(DialogPortal, { container: typeof document !== "undefined" ? document.getElementById("portal-root") ?? document.body : void 0, children: /* @__PURE__ */ jsx(DialogOverlay, { children: /* @__PURE__ */ jsxs(
  DialogPrimitive.Content,
  {
    ref,
    className: cn(
      // Posicionamento via flexbox do overlay — sem fixed/translate no modal
      "relative z-50 grid w-full max-w-lg gap-4 rounded-lg border bg-background p-5 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-6",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxs(DialogClose, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
        /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
      ] })
    ]
  }
) }) }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("animate-pulse rounded-md bg-muted", className),
      ...props
    }
  );
}

export { $$AppLayout as $, Avatar as A, Dialog as D, Skeleton as S, Textarea as T, useCreateGroup as a, useJoinGroup as b, DialogTrigger as c, DialogContent as d, DialogHeader as e, DialogTitle as f, DialogFooter as g, useLogs as h, AvatarImage as i, AvatarFallback as j, useLeaderboard as k, useGroupMembers as l, useCounters as m, useCreateCounter as n, useAddLog as o, DialogDescription as p, queryKeys as q, useGroups as u, withQueryProvider as w };
