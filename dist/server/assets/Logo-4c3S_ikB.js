import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/softly/Logo.tsx
function Logo({ className = "", size = "md" }) {
	const sizes = {
		sm: "text-2xl",
		md: "text-3xl",
		lg: "text-4xl md:text-5xl",
		xl: "text-5xl md:text-7xl"
	}[size];
	return /* @__PURE__ */ jsxs("span", {
		className: `logo-script ${sizes} ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-cream drop-shadow-sm",
			children: "Softly"
		}), /* @__PURE__ */ jsx("span", {
			className: "text-cyan-light",
			children: "nest"
		})]
	});
}
//#endregion
export { Logo as t };
