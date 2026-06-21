import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Logo-4c3S_ikB.js
var import_jsx_runtime = require_jsx_runtime();
function Logo({ className = "", size = "md" }) {
	const sizes = {
		sm: "text-2xl",
		md: "text-3xl",
		lg: "text-4xl md:text-5xl",
		xl: "text-5xl md:text-7xl"
	}[size];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `logo-script ${sizes} ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-cream drop-shadow-sm",
			children: "Softly"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-cyan-light",
			children: "nest"
		})]
	});
}
//#endregion
export { Logo as t };
