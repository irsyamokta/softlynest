import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmptyState-CzJlrCAg.js
var import_jsx_runtime = require_jsx_runtime();
function EmptyState({ icon: Icon, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-border/40 soft-shadow my-4 min-h-[300px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-16 h-16 rounded-full bg-gradient-to-br from-pink/20 to-yellow/20 flex items-center justify-center mb-4 ring-8 ring-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "w-8 h-8 text-cyan",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-extrabold text-black mb-2",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground max-w-sm mx-auto mb-6",
				children: description
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: action })
		]
	});
}
//#endregion
export { EmptyState as t };
