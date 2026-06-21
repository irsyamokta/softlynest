import { h as createFileRoute, m as lazyRouteComponent } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.user._username-8Zaz0aFX.js
var $$splitComponentImporter = () => import("./_shell.user._username-CZB6qYmw.mjs");
var Route = createFileRoute("/_shell/user/$username")({
	head: ({ params }) => ({ meta: [{ title: `@${params.username} — Softlynest` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
