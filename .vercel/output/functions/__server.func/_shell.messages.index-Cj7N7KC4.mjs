import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { l as Send } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.messages.index-Cj7N7KC4.js
var import_jsx_runtime = require_jsx_runtime();
function MessagesIndex() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "hidden md:flex flex-col items-center justify-center h-full text-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-20 h-20 rounded-full border-2 border-foreground flex items-center justify-center mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
					className: "w-8 h-8 text-foreground",
					strokeWidth: 2.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xl font-bold text-foreground",
				children: "Your Messages"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-2 mb-6 text-sm max-w-xs",
				children: "Send private messages to a friend and stay connected."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/search",
				search: { q: "" },
				className: "inline-block px-6 py-2.5 rounded-full bg-cyan text-white font-bold text-sm hover:bg-cyan/90 transition shadow-sm",
				children: "Find people"
			})
		]
	});
}
//#endregion
export { MessagesIndex as component };
