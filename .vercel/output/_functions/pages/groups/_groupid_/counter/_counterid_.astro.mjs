import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead, g as addAttribute } from '../../../../chunks/astro/server_CowkY7Hv.mjs';
import 'piccolore';
import { w as withQueryProvider, h as useLogs, S as Skeleton, A as Avatar, i as AvatarImage, j as AvatarFallback, k as useLeaderboard, $ as $$AppLayout } from '../../../../chunks/skeleton_Dd5LUUDQ.mjs';
import { C as CounterCard } from '../../../../chunks/CounterCard_bxNHjqPw.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { ClipboardList, User, Trophy, Medal } from 'lucide-react';
import { C as Card, b as CardHeader, d as CardTitle, e as CardContent, g as getInitials, r as relativeTime, f as formatNumber } from '../../../../chunks/card_ClVp_5rl.mjs';
import { c as createServerClient } from '../../../../chunks/supabaseServer_1oW6kvE0.mjs';
export { renderers } from '../../../../renderers.mjs';

function LogList({ counter }) {
  const { data: logs, isLoading } = useLogs(counter.id);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsx(ClipboardList, { className: "h-4 w-4 text-primary" }),
      "Histórico"
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [...Array(4)].map((_, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1.5", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-32" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-48" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-10" })
    ] }, i)) }) : !logs || logs.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
      /* @__PURE__ */ jsx(User, { className: "h-8 w-8 text-muted-foreground/50 mb-2" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Sem registros ainda." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Adicione a primeira contribuição!" })
    ] }) : /* @__PURE__ */ jsx("ul", { className: "space-y-3 max-h-96 overflow-y-auto pr-1", children: logs.map((log) => {
      const profile = log.profiles;
      const name = profile?.full_name ?? profile?.username ?? "Usuário";
      return /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3 animate-fade-in", children: [
        /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8 shrink-0 mt-0.5", children: [
          /* @__PURE__ */ jsx(AvatarImage, { src: profile?.avatar_url ?? void 0 }),
          /* @__PURE__ */ jsx(AvatarFallback, { className: "text-xs", children: getInitials(name) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: name }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: relativeTime(log.created_at) })
          ] }),
          log.note && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-2", children: log.note })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-semibold text-primary tabular-nums", children: [
            "+",
            formatNumber(log.amount)
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs text-muted-foreground", children: counter.unit })
        ] })
      ] }, log.id);
    }) }) })
  ] });
}
const LogList$1 = withQueryProvider(LogList);

const RANK_COLORS = ["text-yellow-500", "text-slate-400", "text-amber-600"];
const RANK_ICONS = ["🥇", "🥈", "🥉"];
function Leaderboard({ counterId, unit }) {
  const { data: entries, isLoading } = useLeaderboard(counterId);
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2 text-base", children: [
      /* @__PURE__ */ jsx(Trophy, { className: "h-4 w-4 text-yellow-500" }),
      "Leaderboard"
    ] }) }),
    /* @__PURE__ */ jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsx("div", { className: "space-y-3", children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx(Skeleton, { className: "h-8 w-8 rounded-full" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-1", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3.5 w-24" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-3 w-16" })
      ] }),
      /* @__PURE__ */ jsx(Skeleton, { className: "h-4 w-12" })
    ] }, i)) }) : !entries || entries.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-6 text-center", children: [
      /* @__PURE__ */ jsx(Medal, { className: "h-8 w-8 text-muted-foreground/50 mb-2" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhuma contribuição ainda." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Seja o primeiro!" })
    ] }) : /* @__PURE__ */ jsx("ol", { className: "space-y-2.5", children: entries.map((entry, index) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-7 text-center", children: index < 3 ? /* @__PURE__ */ jsx("span", { className: "text-lg leading-none", role: "img", "aria-label": `${index + 1}º lugar`, children: RANK_ICONS[index] }) : /* @__PURE__ */ jsx("span", { className: `text-sm font-bold tabular-nums ${RANK_COLORS[0]}`, children: index + 1 }) }),
      /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
        /* @__PURE__ */ jsx(AvatarImage, { src: entry.avatar_url ?? void 0 }),
        /* @__PURE__ */ jsx(AvatarFallback, { className: "text-xs", children: getInitials(entry.full_name ?? entry.username) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: entry.full_name ?? entry.username ?? "Usuário" }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold tabular-nums", children: formatNumber(entry.total_amount) }),
        /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs text-muted-foreground", children: unit })
      ] })
    ] }, entry.user_id)) }) })
  ] });
}
const Leaderboard$1 = withQueryProvider(Leaderboard);

const $$Astro = createAstro();
const $$counterId = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$counterId;
  const { groupId, counterId } = Astro2.params;
  const { user } = Astro2.locals;
  const userId = user.id;
  const { supabase } = createServerClient(Astro2.request);
  const { data: membership } = await supabase.from("group_members").select("id").eq("group_id", groupId).eq("user_id", userId).maybeSingle();
  if (!membership) {
    return Astro2.redirect("/dashboard?error=not-member");
  }
  const { data: counter } = await supabase.from("counters").select("*").eq("id", counterId).eq("group_id", groupId).single();
  if (!counter) {
    return Astro2.redirect(`/groups/${groupId}?error=not-found`);
  }
  const counterProps = {
    id: counter.id,
    group_id: counter.group_id,
    name: counter.name,
    unit: counter.unit,
    description: counter.description ?? null,
    goal: counter.goal ?? null,
    deadline: counter.deadline ?? null,
    current_value: counter.current_value,
    created_by: counter.created_by,
    created_at: counter.created_at,
    updated_at: counter.updated_at
  };
  return renderTemplate`${renderComponent($$result, "AppLayout", $$AppLayout, { "title": counter.name }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="space-y-5"> <!-- Breadcrumb --> <nav class="flex items-center gap-2 text-sm text-muted-foreground"> <a href="/dashboard" class="hover:text-foreground transition-colors">Dashboard</a> <span>/</span> <a${addAttribute(`/groups/${groupId}`, "href")} class="hover:text-foreground transition-colors">Grupo</a> <span>/</span> <span class="text-foreground font-medium truncate">${counter.name}</span> </nav> <!-- Counter card (with realtime + add modal) --> ${renderComponent($$result2, "CounterCard", CounterCard, { "counter": counterProps, "userId": userId, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/CounterCard", "client:component-export": "default" })} <!-- Logs + Leaderboard --> <div class="grid gap-4 md:grid-cols-2"> ${renderComponent($$result2, "LogList", LogList$1, { "counter": counterProps, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/LogList", "client:component-export": "default" })} ${renderComponent($$result2, "Leaderboard", Leaderboard$1, { "counterId": counter.id, "unit": counter.unit, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/islands/Leaderboard", "client:component-export": "default" })} </div> </div> ` })}`;
}, "C:/Users/Matheus/Documents/Counter/src/pages/groups/[groupId]/counter/[counterId].astro", void 0);

const $$file = "C:/Users/Matheus/Documents/Counter/src/pages/groups/[groupId]/counter/[counterId].astro";
const $$url = "/groups/[groupId]/counter/[counterId]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$counterId,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
