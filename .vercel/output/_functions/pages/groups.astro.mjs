import { e as createComponent, h as createAstro } from '../chunks/astro/server_CowkY7Hv.mjs';
import 'piccolore';
import 'clsx';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return Astro2.redirect("/dashboard");
}, "C:/Users/Matheus/Documents/Counter/src/pages/groups/index.astro", void 0);

const $$file = "C:/Users/Matheus/Documents/Counter/src/pages/groups/index.astro";
const $$url = "/groups";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
