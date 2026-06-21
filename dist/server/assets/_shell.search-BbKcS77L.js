import { o as getHashtagsFn } from "./post.server-S-YufaV0.js";
import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_shell.search.tsx
var $$splitComponentImporter = () => import("./_shell.search-ByLrDDa8.js");
var Route = createFileRoute("/_shell/search")({
	head: () => ({ meta: [{ title: "Search — Softlynest" }] }),
	loader: () => getHashtagsFn(),
	validateSearch: (search) => ({ q: search.q || "" }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
