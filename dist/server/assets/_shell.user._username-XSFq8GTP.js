import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_shell.user.$username.tsx
var $$splitComponentImporter = () => import("./_shell.user._username-DOdKNPM7.js");
var Route = createFileRoute("/_shell/user/$username")({
	head: ({ params }) => ({ meta: [{ title: `@${params.username} — Softlynest` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
