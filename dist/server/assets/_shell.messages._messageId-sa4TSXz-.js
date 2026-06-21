import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
//#region src/routes/_shell.messages.$messageId.tsx
var $$splitComponentImporter = () => import("./_shell.messages._messageId-Ba3G3W63.js");
var Route = createFileRoute("/_shell/messages/$messageId")({
	head: () => ({ meta: [{ title: "Chat — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
