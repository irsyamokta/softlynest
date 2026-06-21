import { h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as getHashtagsFn } from "./_ssr/post.server-DCbf_Hu9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.search-mDlsw5KN.js
var $$splitComponentImporter = () => import("./_shell.search-CiS-ppb3.mjs");
var Route = createFileRoute("/_shell/search")({
	head: () => ({ meta: [{ title: "Search — Softlynest" }] }),
	loader: () => getHashtagsFn(),
	validateSearch: (search) => ({ q: search.q || "" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
