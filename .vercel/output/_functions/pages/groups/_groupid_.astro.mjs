import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../../chunks/astro/server_CowkY7Hv.mjs';
import 'piccolore';
import { w as withQueryProvider, l as useGroupMembers, A as Avatar, i as AvatarImage, j as AvatarFallback, m as useCounters, S as Skeleton, n as useCreateCounter, D as Dialog, c as DialogTrigger, d as DialogContent, e as DialogHeader, f as DialogTitle, T as Textarea, g as DialogFooter, $ as $$AppLayout } from '../../chunks/skeleton_Dd5LUUDQ.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
import { Settings, Users, Check, Copy, BarChart3, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { B as Button, g as getInitials, h as createCounterSchema, L as Label, I as Input } from '../../chunks/card_ClVp_5rl.mjs';
import { C as CounterCard } from '../../chunks/CounterCard_bxNHjqPw.mjs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { c as createServerClient } from '../../chunks/supabaseServer_1oW6kvE0.mjs';
export { renderers } from '../../renderers.mjs';

function GroupHeader({ group, userId }) {
  const [copied, setCopied] = useState(false);
  const { data: members } = useGroupMembers(group.id);
  async function copyInviteCode() {
    await navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2e3);
  }
  const isOwner = group.owner_id === userId;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold truncate", children: group.name }),
        group.description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-0.5 line-clamp-2", children: group.description })
      ] }),
      isOwner && /* @__PURE__ */ jsx(Button, { size: "icon", variant: "ghost", "aria-label": "Configurações do grupo", children: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex -space-x-2", children: [
          (members ?? []).slice(0, 5).map((m) => /* @__PURE__ */ jsxs(Avatar, { className: "h-7 w-7 border-2 border-background", children: [
            /* @__PURE__ */ jsx(AvatarImage, { src: m.profiles?.avatar_url ?? void 0 }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "text-xs", children: getInitials(m.profiles?.full_name ?? m.profiles?.username) })
          ] }, m.id)),
          (members?.length ?? 0) > 5 && /* @__PURE__ */ jsxs("div", { className: "flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium", children: [
            "+",
            (members?.length ?? 0) - 5
          ] })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Users, { className: "h-3.5 w-3.5" }),
          members?.length ?? 0,
          " membros"
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: copyInviteCode,
          className: "flex items-center gap-1.5 rounded-full border bg-secondary px-3 py-1 text-xs font-mono font-medium hover:bg-accent transition-colors",
          children: [
            copied ? /* @__PURE__ */ jsx(Check, { className: "h-3 w-3 text-green-500" }) : /* @__PURE__ */ jsx(Copy, { className: "h-3 w-3" }),
            group.invite_code
          ]
        }
      )
    ] })
  ] });
}
const GroupHeader$1 = withQueryProvider(GroupHeader);

function CounterGrid({ groupId, userId }) {
  const { data: counters, isLoading } = useCounters(groupId);
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-48 rounded-xl" }, i)) });
  }
  if (!counters || counters.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center", children: [
      /* @__PURE__ */ jsx(BarChart3, { className: "h-10 w-10 text-muted-foreground/50 mb-3" }),
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: "Nenhum contador ainda" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Crie o primeiro contador do grupo!" })
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2", children: counters.map((counter) => /* @__PURE__ */ jsx(
    CounterCard,
    {
      counter,
      userId,
      onNavigate: (id) => {
        window.location.href = `/groups/${groupId}/counter/${id}`;
      }
    },
    counter.id
  )) });
}
const CounterGrid$1 = withQueryProvider(CounterGrid);

function CreateCounterModal({ groupId, userId }) {
  const createCounter = useCreateCounter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(createCounterSchema),
    defaultValues: { unit: "un" }
  });
  async function onSubmit(data) {
    try {
      const goal = data.goal && data.goal !== "" ? Number(data.goal) : void 0;
      const deadline = data.deadline && data.deadline !== "" ? data.deadline : void 0;
      await createCounter.mutateAsync({
        group_id: groupId,
        created_by: userId,
        name: data.name,
        unit: data.unit,
        description: data.description || void 0,
        goal: goal ?? null,
        deadline: deadline ?? null
      });
      toast.success("Contador criado!");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar contador.");
    }
  }
  return /* @__PURE__ */ jsxs(Dialog, { children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-1.5", children: [
      /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
      "Contador"
    ] }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { children: /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5 text-primary" }),
        "Novo contador"
      ] }) }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "counter-name", children: "Nome *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "counter-name",
              placeholder: "Ex: Km rodados juntos",
              ...register("name")
            }
          ),
          errors.name && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.name.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsx(Label, { htmlFor: "counter-unit", children: "Unidade *" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "counter-unit",
              placeholder: "Ex: km, cervejas, episódios…",
              ...register("unit")
            }
          ),
          errors.unit && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.unit.message })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxs(Label, { htmlFor: "counter-desc", children: [
            "Descrição ",
            /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "(opcional)" })
          ] }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              id: "counter-desc",
              placeholder: "Detalhes sobre o contador…",
              rows: 2,
              ...register("description")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "counter-goal", children: [
              "Meta ",
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "(opcional)" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "counter-goal",
                type: "number",
                step: "0.01",
                min: "0.01",
                placeholder: "Ex: 500",
                ...register("goal")
              }
            ),
            errors.goal && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errors.goal.message })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "counter-deadline", children: [
              "Prazo ",
              /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "(opcional)" })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "counter-deadline",
                type: "date",
                min: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
                ...register("deadline")
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(DialogFooter, { className: "pt-2", children: /* @__PURE__ */ jsxs(Button, { type: "submit", disabled: createCounter.isPending, className: "w-full gap-2", children: [
          createCounter.isPending ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
          "Criar contador"
        ] }) })
      ] })
    ] })
  ] });
}
const CreateCounterModal$1 = withQueryProvider(CreateCounterModal);

const $$Astro = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const { groupId } = Astro2.params;
  const { user } = Astro2.locals;
  const userId = user.id;
  const { supabase } = createServerClient(Astro2.request);
  const { data: membership } = await supabase.from("group_members").select("id").eq("group_id", groupId).eq("user_id", userId).maybeSingle();
  if (!membership) {
    return Astro2.redirect("/dashboard?error=not-member");
  }
  const { data: group } = await supabase.from("groups").select("*").eq("id", groupId).single();
  if (!group) {
    return Astro2.redirect("/dashboard?error=not-found");
  }
  const groupProps = {
    id: group.id,
    name: group.name,
    description: group.description ?? null,
    invite_code: group.invite_code,
    owner_id: group.owner_id,
    created_at: group.created_at,
    updated_at: group.updated_at
  };
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": group.name }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-6"> <!-- Group header: name, invite code, members --> ${renderComponent($$result2, "GroupHeader", GroupHeader$1, { "group": groupProps, "userId": userId, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/GroupHeader", "client:component-export": "default" })} <!-- Counters section --> <div class="space-y-3"> <div class="flex items-center justify-between"> <h2 class="text-lg font-semibold">Contadores</h2> ${renderComponent($$result2, "CreateCounterModal", CreateCounterModal$1, { "groupId": groupId, "userId": userId, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/CreateCounterModal", "client:component-export": "default" })} </div> ${renderComponent($$result2, "CounterGrid", CounterGrid$1, { "groupId": groupId, "userId": userId, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/CounterGrid", "client:component-export": "default" })} </div> </div> ` })}`;
}, "C:/Users/Matheus/Documents/Counter/src/pages/groups/[groupId]/index.astro", void 0);

const $$file = "C:/Users/Matheus/Documents/Counter/src/pages/groups/[groupId]/index.astro";
const $$url = "/groups/[groupId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
