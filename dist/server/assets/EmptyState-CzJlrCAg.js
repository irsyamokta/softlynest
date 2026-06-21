import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/softly/EmptyState.tsx
function EmptyState({ icon: Icon, title, description, action }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-border/40 soft-shadow my-4 min-h-[300px]",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-16 h-16 rounded-full bg-gradient-to-br from-pink/20 to-yellow/20 flex items-center justify-center mb-4 ring-8 ring-white",
				children: /* @__PURE__ */ jsx(Icon, {
					className: "w-8 h-8 text-cyan",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "text-xl font-extrabold text-black mb-2",
				children: title
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground max-w-sm mx-auto mb-6",
				children: description
			}),
			action && /* @__PURE__ */ jsx("div", { children: action })
		]
	});
}
//#endregion
export { EmptyState as t };
