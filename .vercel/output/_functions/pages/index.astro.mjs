import { e as createComponent, k as renderComponent, r as renderTemplate, h as createAstro, m as maybeRenderHead } from '../chunks/astro/server_CowkY7Hv.mjs';
import 'piccolore';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_BAlhSXM7.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  if (Astro2.locals.session) {
    return Astro2.redirect("/dashboard");
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "In\xEDcio" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center"> <!-- Hero --> <div class="animate-slide-up space-y-6 max-w-2xl"> <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl shadow-lg">
🔢
</div> <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
Contador Coletivo
</h1> <p class="text-lg text-muted-foreground max-w-md mx-auto">
Registre conquistas coletivas com seus amigos em tempo real.
        Corram juntos, bebam juntos, assistam juntos. <strong>Contem juntos.</strong> </p> <div class="flex flex-col sm:flex-row gap-3 justify-center"> <a href="/login" class="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors">
Começar agora
</a> <a href="/login" class="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-8 text-sm font-medium hover:bg-accent transition-colors">
Entrar com conta
</a> </div> </div> <!-- Feature cards --> <div class="mt-20 grid gap-4 sm:grid-cols-3 max-w-3xl w-full"> <div class="rounded-xl border bg-card p-5 text-left space-y-2"> <div class="text-3xl">⚡</div> <h3 class="font-semibold">Tempo real</h3> <p class="text-sm text-muted-foreground">Todos os membros veem atualizações instantâneas.</p> </div> <div class="rounded-xl border bg-card p-5 text-left space-y-2"> <div class="text-3xl">🎯</div> <h3 class="font-semibold">Metas coletivas</h3> <p class="text-sm text-muted-foreground">Defina goals e acompanhe o progresso com barra visual.</p> </div> <div class="rounded-xl border bg-card p-5 text-left space-y-2"> <div class="text-3xl">🏆</div> <h3 class="font-semibold">Leaderboard</h3> <p class="text-sm text-muted-foreground">Ranking de quem mais contribuiu para cada contador.</p> </div> </div> </div> ` })}`;
}, "C:/Users/Matheus/Documents/Counter/src/pages/index.astro", void 0);

const $$file = "C:/Users/Matheus/Documents/Counter/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
