import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_CowkY7Hv.mjs';
import 'piccolore';
import { w as withQueryProvider, u as useGroups, a as useCreateGroup, b as useJoinGroup, D as Dialog, c as DialogTrigger, d as DialogContent, e as DialogHeader, f as DialogTitle, T as Textarea, g as DialogFooter, S as Skeleton, $ as $$AppLayout } from '../chunks/skeleton_Dd5LUUDQ.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2, Hash, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { c as cn, a as createGroupSchema, j as joinGroupSchema, B as Button, L as Label, I as Input, p as parseError } from '../chunks/card_ClVp_5rl.mjs';
import * as TabsPrimitive from '@radix-ui/react-tabs';
export { renderers } from '../renderers.mjs';

const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

function GroupList({ userId }) {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: groups, isLoading } = useGroups(userId);
  const createGroup = useCreateGroup();
  const joinGroup = useJoinGroup();
  const createForm = useForm({ resolver: zodResolver(createGroupSchema) });
  const joinForm = useForm({ resolver: zodResolver(joinGroupSchema) });
  async function onCreateSubmit(data) {
    try {
      const group = await createGroup.mutateAsync({ ...data, userId });
      toast.success(`Grupo "${group.name}" criado!`);
      setCreateOpen(false);
      createForm.reset();
    } catch (err) {
      toast.error(parseError(err));
    }
  }
  async function onJoinSubmit(data) {
    try {
      const group = await joinGroup.mutateAsync({ inviteCode: data.inviteCode, userId });
      toast.success(`Entrou no grupo "${group.name}"!`);
      setCreateOpen(false);
      joinForm.reset();
    } catch (err) {
      toast.error(parseError(err));
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold", children: "Meus Grupos" }),
      /* @__PURE__ */ jsxs(Dialog, { open: createOpen, onOpenChange: setCreateOpen, children: [
        /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-1.5", children: [
          /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Novo"
        ] }) }),
        /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
          /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsx(DialogTitle, { children: "Criar ou entrar em grupo" }) }),
          /* @__PURE__ */ jsxs(Tabs, { defaultValue: "create", children: [
            /* @__PURE__ */ jsxs(TabsList, { className: "w-full", children: [
              /* @__PURE__ */ jsx(TabsTrigger, { value: "create", className: "flex-1", children: "Criar grupo" }),
              /* @__PURE__ */ jsx(TabsTrigger, { value: "join", className: "flex-1", children: "Entrar com código" })
            ] }),
            /* @__PURE__ */ jsx(TabsContent, { value: "create", children: /* @__PURE__ */ jsxs("form", { onSubmit: createForm.handleSubmit(onCreateSubmit), className: "space-y-3 pt-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "group-name", children: "Nome do grupo" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "group-name",
                    placeholder: "Ex: Turma da corrida 🏃",
                    ...createForm.register("name")
                  }
                ),
                createForm.formState.errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: createForm.formState.errors.name.message })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs(Label, { htmlFor: "group-desc", children: [
                  "Descrição ",
                  /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "(opcional)" })
                ] }),
                /* @__PURE__ */ jsx(
                  Textarea,
                  {
                    id: "group-desc",
                    placeholder: "Do que se trata o grupo…",
                    rows: 2,
                    ...createForm.register("description")
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: createGroup.isPending, className: "w-full gap-2", children: [
                createGroup.isPending && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
                "Criar grupo"
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsx(TabsContent, { value: "join", children: /* @__PURE__ */ jsxs("form", { onSubmit: joinForm.handleSubmit(onJoinSubmit), className: "space-y-3 pt-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "invite-code", children: "Código de convite" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Hash, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "invite-code",
                      placeholder: "ABC123",
                      maxLength: 6,
                      className: "pl-9 uppercase font-mono text-lg tracking-widest",
                      ...joinForm.register("inviteCode"),
                      onChange: (e) => {
                        e.target.value = e.target.value.toUpperCase();
                        void joinForm.register("inviteCode").onChange(e);
                      }
                    }
                  )
                ] }),
                joinForm.formState.errors.inviteCode && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: joinForm.formState.errors.inviteCode.message })
              ] }),
              /* @__PURE__ */ jsx(DialogFooter, { children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: joinGroup.isPending, className: "w-full gap-2", children: [
                joinGroup.isPending && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
                "Entrar no grupo"
              ] }) })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-28 rounded-xl" }, i)) }) : !groups || groups.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center", children: [
      /* @__PURE__ */ jsx(Users, { className: "h-10 w-10 text-muted-foreground/50 mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Nenhum grupo ainda" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Crie um grupo ou entre com um código de convite." })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: groups.map((group) => /* @__PURE__ */ jsx(
      "a",
      {
        href: `/groups/${group.id}`,
        className: "group block rounded-xl border bg-card p-4 hover:bg-accent transition-colors",
        children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold truncate", children: group.name }),
            group.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: group.description }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs text-muted-foreground font-mono", children: [
              /* @__PURE__ */ jsx(Hash, { className: "h-3 w-3" }),
              group.invite_code
            ] })
          ] }),
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors mt-0.5" })
        ] })
      },
      group.id
    )) })
  ] });
}
const GroupList$1 = withQueryProvider(GroupList);

const $$Astro = createAstro();
const $$Dashboard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const { user } = Astro2.locals;
  const userId = user.id;
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <div> <h1 class="text-2xl font-bold">Dashboard</h1> <p class="text-muted-foreground text-sm mt-1">
Bem-vindo de volta! Veja seus grupos e contadores.
</p> </div> <!--
      GroupList já inclui o QueryProvider internamente.
      Em Astro, cada island é hidratado de forma independente.
    --> ${renderComponent($$result2, "GroupList", GroupList$1, { "userId": userId, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/GroupList", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Users/Matheus/Documents/Counter/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/Matheus/Documents/Counter/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
