import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/post.$id.tsx
var $$splitComponentImporter = () => import("./post._id-CDwPcSCe.js");
var Route = createFileRoute("/post/$id")({
	head: () => ({ meta: [{ title: `Post — Softlynest` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
