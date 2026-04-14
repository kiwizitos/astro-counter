import 'piccolore';
import { o as decodeKey } from './chunks/astro/server_CowkY7Hv.mjs';
import 'clsx';
import './chunks/astro-designed-error-pages_pJO34LDA.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_D1qUSEk0.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/Matheus/Documents/Counter/","cacheDir":"file:///C:/Users/Matheus/Documents/Counter/node_modules/.astro/","outDir":"file:///C:/Users/Matheus/Documents/Counter/dist/","srcDir":"file:///C:/Users/Matheus/Documents/Counter/src/","publicDir":"file:///C:/Users/Matheus/Documents/Counter/public/","buildClientDir":"file:///C:/Users/Matheus/Documents/Counter/dist/client/","buildServerDir":"file:///C:/Users/Matheus/Documents/Counter/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dashboard.CaUVbutK.css"}],"routeData":{"route":"/dashboard","isIndex":false,"type":"page","pattern":"^\\/dashboard\\/?$","segments":[[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/dashboard.astro","pathname":"/dashboard","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dashboard.CaUVbutK.css"}],"routeData":{"route":"/groups/[groupid]/counter/[counterid]","isIndex":false,"type":"page","pattern":"^\\/groups\\/([^/]+?)\\/counter\\/([^/]+?)\\/?$","segments":[[{"content":"groups","dynamic":false,"spread":false}],[{"content":"groupId","dynamic":true,"spread":false}],[{"content":"counter","dynamic":false,"spread":false}],[{"content":"counterId","dynamic":true,"spread":false}]],"params":["groupId","counterId"],"component":"src/pages/groups/[groupId]/counter/[counterId].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dashboard.CaUVbutK.css"}],"routeData":{"route":"/groups/[groupid]","isIndex":true,"type":"page","pattern":"^\\/groups\\/([^/]+?)\\/?$","segments":[[{"content":"groups","dynamic":false,"spread":false}],[{"content":"groupId","dynamic":true,"spread":false}]],"params":["groupId"],"component":"src/pages/groups/[groupId]/index.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/groups","isIndex":true,"type":"page","pattern":"^\\/groups\\/?$","segments":[[{"content":"groups","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/groups/index.astro","pathname":"/groups","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dashboard.CaUVbutK.css"}],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/dashboard.CaUVbutK.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/Matheus/Documents/Counter/src/pages/dashboard.astro",{"propagation":"none","containsHead":true}],["C:/Users/Matheus/Documents/Counter/src/pages/groups/[groupId]/counter/[counterId].astro",{"propagation":"none","containsHead":true}],["C:/Users/Matheus/Documents/Counter/src/pages/groups/[groupId]/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Matheus/Documents/Counter/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/Matheus/Documents/Counter/src/pages/login.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/dashboard@_@astro":"pages/dashboard.astro.mjs","\u0000@astro-page:src/pages/groups/[groupId]/counter/[counterId]@_@astro":"pages/groups/_groupid_/counter/_counterid_.astro.mjs","\u0000@astro-page:src/pages/groups/[groupId]/index@_@astro":"pages/groups/_groupid_.astro.mjs","\u0000@astro-page:src/pages/groups/index@_@astro":"pages/groups.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BmUGnhhk.mjs","C:/Users/Matheus/Documents/Counter/node_modules/@astrojs/react/dist/vnode-children.js":"chunks/vnode-children_Gljd-95D.mjs","C:/Users/Matheus/Documents/Counter/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_C6N0lhgf.mjs","@/components/islands/CreateCounterModal":"_astro/CreateCounterModal.GHP4eKRl.js","@/components/islands/CounterGrid":"_astro/CounterGrid.DXPcAEF8.js","@/components/islands/LogList":"_astro/LogList.BJhMLHvL.js","@/components/islands/Leaderboard":"_astro/Leaderboard.DgwwHzkx.js","@/components/islands/GroupHeader":"_astro/GroupHeader.CwYMfKiu.js","C:/Users/Matheus/Documents/Counter/src/components/layout/AppHeader":"_astro/AppHeader.KIKIrYa1.js","@/components/islands/AuthForm":"_astro/AuthForm.BxN03TSy.js","@astrojs/react/client.js":"_astro/client.Cfty46Yg.js","@/components/islands/GroupList":"_astro/GroupList.CYmAcai8.js","@/components/islands/CounterCard":"_astro/CounterCard.DrNZd_kw.js","sonner":"_astro/_astro-entry_sonner.C3j2yB4B.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/dashboard.CaUVbutK.css","/favicon.ico","/favicon.svg","/_astro/AppHeader.KIKIrYa1.js","/_astro/AuthForm.BxN03TSy.js","/_astro/avatar.DLM78ErC.js","/_astro/button.D67agMoO.js","/_astro/card.C1XgPAlG.js","/_astro/chart-column.rrSn4i3S.js","/_astro/client.Cfty46Yg.js","/_astro/CounterCard.DrNZd_kw.js","/_astro/CounterGrid.DXPcAEF8.js","/_astro/CreateCounterModal.GHP4eKRl.js","/_astro/dialog.pyiub2SB.js","/_astro/GroupHeader.CwYMfKiu.js","/_astro/GroupList.CYmAcai8.js","/_astro/index.Bb_kaLrq.js","/_astro/index.Cm1PhAo7.js","/_astro/index.colhe2oe.js","/_astro/index.CR_QCXMF.js","/_astro/index.CuF1LglC.js","/_astro/label.Cklbyowh.js","/_astro/Leaderboard.DgwwHzkx.js","/_astro/LogList.BJhMLHvL.js","/_astro/QueryProvider.CUBe5WzL.js","/_astro/skeleton.BOhUGyL0.js","/_astro/user.BNubHVaL.js","/_astro/users.NT0x_9hw.js","/_astro/_astro-entry_sonner.C3j2yB4B.js","/_astro/_astro-entry_sonner.Chjd7m8J.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"+Oxl4zW0WM7yXb6Le1zxrRWT5jc84Q1ZV2Kzhek+YSs="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
