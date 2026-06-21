import { t as AuthProvider } from "./AuthContext-DiFfoXlB.js";
import { t as Route$12 } from "./post._id-72e6KcD6.js";
import { t as Route$13 } from "./_shell.search-BbKcS77L.js";
import { t as Route$14 } from "./_shell.user._username-XSFq8GTP.js";
import { t as Route$15 } from "./_shell.messages._messageId-sa4TSXz-.js";
import { useEffect } from "react";
import { HeadContent, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		theme: "light",
		className: "toaster group",
		richColors: true,
		...props
	});
};
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-DQqvT0q4.css";
//#endregion
//#region src/lib/lovable-error-reporting.ts
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-nest px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center bg-cream rounded-3xl p-8 soft-shadow",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-6xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "This page got lost in the nest."
				}),
				/* @__PURE__ */ jsx("a", {
					href: "/",
					className: "mt-6 inline-block rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-primary-foreground",
					children: "Back home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	useEffect(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-nest px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center bg-cream rounded-3xl p-8 soft-shadow",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold",
					children: "Something went off"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Take a breath and try again."
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => {
						router.invalidate();
						reset();
					},
					className: "mt-6 inline-block rounded-full bg-cyan px-5 py-2.5 text-sm font-semibold text-primary-foreground",
					children: "Try again"
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "Softlynest — A Safe Place to Breathe, Share, and Heal" },
			{
				name: "description",
				content: "Softlynest is a gentle social space for sharing, healing, and supporting one another."
			},
			{
				name: "author",
				content: "Softlynest"
			},
			{
				property: "og:title",
				content: "Softlynest"
			},
			{
				property: "og:description",
				content: "A Safe Place to Breathe, Share, and Heal."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&family=Sarina&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	return /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx(Outlet, {}), /* @__PURE__ */ jsx(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	}) });
}
//#endregion
//#region src/routes/register.tsx
var $$splitComponentImporter$10 = () => import("./register-B5zBbvyY.js");
var Route$10 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Create account — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
//#endregion
//#region src/routes/_shell.tsx
var $$splitComponentImporter$9 = () => import("./_shell-BDFqun_v.js");
var Route$9 = createFileRoute("/_shell")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$8 = () => import("./routes-CTm19Ws5.js");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Softlynest — A Safe Place to Breathe, Share, and Heal" }, {
		name: "description",
		content: "Sign in to Softlynest, a gentle social space for sharing, healing, and support."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
//#endregion
//#region src/routes/_shell.settings.tsx
var $$splitComponentImporter$7 = () => import("./_shell.settings-C2fo14K3.js");
var Route$7 = createFileRoute("/_shell/settings")({
	head: () => ({ meta: [{ title: "Settings — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
//#endregion
//#region src/routes/_shell.profile.tsx
var $$splitComponentImporter$6 = () => import("./_shell.profile-BZheI_UM.js");
var Route$6 = createFileRoute("/_shell/profile")({
	head: () => ({ meta: [{ title: "Profile — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
//#endregion
//#region src/routes/_shell.post.tsx
var $$splitComponentImporter$5 = () => import("./_shell.post-Cx7snZMs.js");
var Route$5 = createFileRoute("/_shell/post")({
	head: () => ({ meta: [{ title: "New post — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/_shell.notifications.tsx
var $$splitComponentImporter$4 = () => import("./_shell.notifications-DSimi-5e.js");
var Route$4 = createFileRoute("/_shell/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/_shell.messages.tsx
var $$splitComponentImporter$3 = () => import("./_shell.messages-BvcijCVs.js");
var Route$3 = createFileRoute("/_shell/messages")({
	head: () => ({ meta: [{ title: "Messages — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
//#endregion
//#region src/routes/_shell.home.tsx
var $$splitComponentImporter$2 = () => import("./_shell.home-jj4IBlBd.js");
var Route$2 = createFileRoute("/_shell/home")({
	head: () => ({ meta: [{ title: "Home — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
//#endregion
//#region src/routes/_shell.favorites.tsx
var $$splitComponentImporter$1 = () => import("./_shell.favorites-DrxLyf64.js");
var Route$1 = createFileRoute("/_shell/favorites")({
	head: () => ({ meta: [{ title: "Favorites — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/_shell.messages.index.tsx
var $$splitComponentImporter = () => import("./_shell.messages.index-Cj7N7KC4.js");
var Route = createFileRoute("/_shell/messages/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var RegisterRoute = Route$10.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$11
});
var ShellRoute = Route$9.update({
	id: "/_shell",
	getParentRoute: () => Route$11
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$11
});
var PostIdRoute = Route$12.update({
	id: "/post/$id",
	path: "/post/$id",
	getParentRoute: () => Route$11
});
var ShellSettingsRoute = Route$7.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => ShellRoute
});
var ShellSearchRoute = Route$13.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => ShellRoute
});
var ShellProfileRoute = Route$6.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => ShellRoute
});
var ShellPostRoute = Route$5.update({
	id: "/post",
	path: "/post",
	getParentRoute: () => ShellRoute
});
var ShellNotificationsRoute = Route$4.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => ShellRoute
});
var ShellMessagesRoute = Route$3.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => ShellRoute
});
var ShellHomeRoute = Route$2.update({
	id: "/home",
	path: "/home",
	getParentRoute: () => ShellRoute
});
var ShellFavoritesRoute = Route$1.update({
	id: "/favorites",
	path: "/favorites",
	getParentRoute: () => ShellRoute
});
var ShellMessagesIndexRoute = Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => ShellMessagesRoute
});
var ShellUserUsernameRoute = Route$14.update({
	id: "/user/$username",
	path: "/user/$username",
	getParentRoute: () => ShellRoute
});
var ShellMessagesRouteChildren = {
	ShellMessagesMessageIdRoute: Route$15.update({
		id: "/$messageId",
		path: "/$messageId",
		getParentRoute: () => ShellMessagesRoute
	}),
	ShellMessagesIndexRoute
};
var ShellRouteChildren = {
	ShellFavoritesRoute,
	ShellHomeRoute,
	ShellMessagesRoute: ShellMessagesRoute._addFileChildren(ShellMessagesRouteChildren),
	ShellNotificationsRoute,
	ShellPostRoute,
	ShellProfileRoute,
	ShellSearchRoute,
	ShellSettingsRoute,
	ShellUserUsernameRoute
};
var rootRouteChildren = {
	IndexRoute,
	ShellRoute: ShellRoute._addFileChildren(ShellRouteChildren),
	RegisterRoute,
	PostIdRoute
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
