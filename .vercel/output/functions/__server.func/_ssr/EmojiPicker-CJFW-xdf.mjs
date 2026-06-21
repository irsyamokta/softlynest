import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { s as Smile } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmojiPicker-CJFW-xdf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMOJI_CATEGORIES = [
	{
		label: "Soft & Kind",
		emojis: [
			"🥺",
			"💗",
			"🌸",
			"🌿",
			"✨",
			"💫",
			"🌱",
			"🍵",
			"☕",
			"🌙",
			"🌊",
			"💙",
			"🩷",
			"🤍",
			"🌼",
			"🌻",
			"🫶",
			"🤗",
			"😊",
			"🥰"
		]
	},
	{
		label: "Feelings",
		emojis: [
			"😔",
			"😢",
			"😭",
			"😩",
			"😤",
			"😅",
			"😂",
			"🥲",
			"😐",
			"😶",
			"🫠",
			"😴",
			"🥱",
			"😪",
			"🤒",
			"🤯",
			"😵",
			"🫥",
			"😑",
			"😏"
		]
	},
	{
		label: "Gestures",
		emojis: [
			"👍",
			"👏",
			"🙌",
			"🤝",
			"🫂",
			"🤜",
			"✌️",
			"🤞",
			"🫰",
			"👌",
			"🙏",
			"💪",
			"🦾",
			"🫁",
			"🧠",
			"👀",
			"💌",
			"📝",
			"🎉",
			"🎊"
		]
	},
	{
		label: "Nature",
		emojis: [
			"🌸",
			"🌹",
			"🌺",
			"🌻",
			"🌼",
			"🍀",
			"🌿",
			"🍃",
			"🌱",
			"🌾",
			"🍂",
			"🍁",
			"🌈",
			"⭐",
			"🌟",
			"💫",
			"☀️",
			"🌤️",
			"🌙",
			"❄️"
		]
	}
];
function EmojiPicker({ onEmojiSelect, buttonClassName }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)(0);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClick(e) {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		}
		if (open) document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setOpen((v) => !v),
				"aria-label": "Open emoji picker",
				className: buttonClassName ?? "text-foreground/60 hover:text-cyan transition cursor-pointer p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, {
					className: "w-6 h-6",
					strokeWidth: 2
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute bottom-full mb-2 left-0 z-50 w-72 bg-white rounded-xl shadow-xl border border-border/60 overflow-hidden",
				style: { animation: "slideUp 0.15s ease-out" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex border-b border-border/40 overflow-x-auto scrollbar-none",
					children: EMOJI_CATEGORIES.map((cat, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setActiveTab(i),
						className: `flex-1 text-[10px] font-bold py-2 px-1 whitespace-nowrap transition cursor-pointer ${activeTab === i ? "text-cyan border-b-2 border-cyan" : "text-muted-foreground hover:text-foreground"}`,
						children: cat.label
					}, cat.label))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3 grid grid-cols-8 gap-1 max-h-44 overflow-y-auto",
					children: EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onEmojiSelect(emoji);
							setOpen(false);
						},
						className: "text-xl w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition cursor-pointer",
						"aria-label": emoji,
						children: emoji
					}, emoji))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      ` })
		]
	});
}
//#endregion
export { EmojiPicker as t };
