import { e as createComponent, g as addAttribute, n as renderHead, l as renderSlot, k as renderComponent, r as renderTemplate, h as createAstro } from './astro/server_CowkY7Hv.mjs';
import 'piccolore';
/* empty css                             */
import { Toaster } from 'sonner';

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Contador Coletivo",
    description = "Registre contagens coletivas com seus amigos em tempo real."
  } = Astro2.props;
  return renderTemplate`<html lang="pt-BR" class="dark" data-astro-cid-o7hvdbfg> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description"${addAttribute(description, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title} — Contador Coletivo</title><!-- Preconnect to Google Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body class="min-h-screen bg-background" data-astro-cid-o7hvdbfg> ${renderSlot($$result, $$slots["default"])} <!-- Portal root: modais do Radix UI são teleportados aqui, fora de qualquer transform/filter --> <div id="portal-root" data-astro-cid-o7hvdbfg></div> <!-- Sonner toast provider (rendered as client island) --> ${renderComponent($$result, "Toaster", Toaster, { "richColors": true, "position": "top-right", "toastOptions": { className: "font-sans" }, "client:load": true, "client:component-hydration": "load", "client:component-path": "sonner", "client:component-export": "Toaster", "data-astro-cid-o7hvdbfg": true })} </body></html>`;
}, "C:/Users/Matheus/Documents/Counter/src/components/layout/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
