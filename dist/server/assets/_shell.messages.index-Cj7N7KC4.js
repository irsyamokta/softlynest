import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Send } from "lucide-react";
//#region src/routes/_shell.messages.index.tsx?tsr-split=component
function MessagesIndex() {
	return /* @__PURE__ */ jsxs("div", {
		className: "hidden md:flex flex-col items-center justify-center h-full text-center px-4",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-20 h-20 rounded-full border-2 border-foreground flex items-center justify-center mb-4",
				children: /* @__PURE__ */ jsx(Send, {
					className: "w-8 h-8 text-foreground",
					strokeWidth: 2.5
				})
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "text-xl font-bold text-foreground",
				children: "Your Messages"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground mt-2 mb-6 text-sm max-w-xs",
				children: "Send private messages to a friend and stay connected."
			}),
			/* @__PURE__ */ jsx(Link, {
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
