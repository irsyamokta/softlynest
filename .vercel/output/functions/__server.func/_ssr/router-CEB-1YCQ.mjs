import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as AuthProvider } from "./AuthContext-DiFfoXlB.mjs";
import { b as useRouter, c as HeadContent, d as createRouter, g as createRootRouteWithContext, h as createFileRoute, m as lazyRouteComponent, p as Outlet, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$12 } from "../_shell.messages._messageId-C9ggHKDq.mjs";
import { t as Route$13 } from "../_shell.search-mDlsw5KN.mjs";
import { t as Route$14 } from "../_shell.user._username-8Zaz0aFX.mjs";
import { t as Route$15 } from "./post._id-lgSaDhv3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CEB-1YCQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "light",
		className: "toaster group",
		richColors: true,
		...props
	});
};
var styles_default = "/assets/styles-B8iD_VHO.css";
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
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-nest px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center bg-cream rounded-3xl p-8 soft-shadow",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-6xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "This page got lost in the nest."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
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
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-nest px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center bg-cream rounded-3xl p-8 soft-shadow",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "Something went off"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Take a breath and try again."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
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
			},
			{
				name: "theme-color",
				content: "#ffffff"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Softlynest"
			}
		],
		links: [
			{
				rel: "icon",
				href: "/favicon.svg"
			},
			{
				rel: "manifest",
				href: "/manifest.json"
			},
			{
				rel: "apple-touch-icon",
				href: "/icons/apple-touch-icon.png"
			},
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	(0, import_react.useEffect)(() => {
		if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch((err) => {
			console.warn("SW registration failed:", err);
		});
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	}) });
}
var $$splitComponentImporter$10 = () => import("./register-CI1FlNrG.mjs");
var Route$10 = createFileRoute("/register")({
	head: () => ({ meta: [{ title: "Create account — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("../_shell-B-nj8lT_.mjs");
var Route$9 = createFileRoute("/_shell")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./routes-QgS-Ovie.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Softlynest — A Safe Place to Breathe, Share, and Heal" }, {
		name: "description",
		content: "Sign in to Softlynest, a gentle social space for sharing, healing, and support."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("../_shell.settings-CUr-CPC1.mjs");
var Route$7 = createFileRoute("/_shell/settings")({
	head: () => ({ meta: [{ title: "Settings — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("../_shell.profile-CqWpaEEo.mjs");
var Route$6 = createFileRoute("/_shell/profile")({
	head: () => ({ meta: [{ title: "Profile — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("../_shell.post-CkAYhrQb.mjs");
var Route$5 = createFileRoute("/_shell/post")({
	head: () => ({ meta: [{ title: "New post — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("../_shell.notifications-C7g9jHie.mjs");
var Route$4 = createFileRoute("/_shell/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("../_shell.messages-BMB6hS8l.mjs");
var Route$3 = createFileRoute("/_shell/messages")({
	head: () => ({ meta: [{ title: "Messages — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_shell.home-o0QHaCHP.mjs");
var Route$2 = createFileRoute("/_shell/home")({
	head: () => ({ meta: [{ title: "Home — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_shell.favorites-DYK_PTed.mjs");
var Route$1 = createFileRoute("/_shell/favorites")({
	head: () => ({ meta: [{ title: "Favorites — Softlynest" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_shell.messages.index-Cj7N7KC4.mjs");
var Route = createFileRoute("/_shell/messages/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
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
var PostIdRoute = Route$15.update({
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
	ShellMessagesMessageIdRoute: Route$12.update({
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
