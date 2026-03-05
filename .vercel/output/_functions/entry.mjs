import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_M5bzUR6n.mjs';
import { manifest } from './manifest_DyjLlH-P.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/create-team.astro.mjs');
const _page3 = () => import('./pages/api/register.astro.mjs');
const _page4 = () => import('./pages/api/update-score.astro.mjs');
const _page5 = () => import('./pages/registro.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/create-team.ts", _page2],
    ["src/pages/api/register.ts", _page3],
    ["src/pages/api/update-score.ts", _page4],
    ["src/pages/registro.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "de5bcc47-eb61-4939-901c-3622985185ec",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
