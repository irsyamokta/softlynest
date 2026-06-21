import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { createPortal } from "react-dom";
//#region src/components/softly/ConfirmModal.tsx
function ConfirmModal({ title, description, confirmText = "Confirm", cancelText = "Cancel", variant = "primary", onConfirm, onClose }) {
	const [isClosing, setIsClosing] = useState(false);
	const handleClose = () => {
		setIsClosing(true);
		setTimeout(onClose, 200);
	};
	const handleConfirm = () => {
		setIsClosing(true);
		setTimeout(() => {
			onConfirm();
			onClose();
		}, 200);
	};
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") handleClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);
	return createPortal(/* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[200] flex items-center justify-center p-6",
		style: { animation: isClosing ? "fadeOut 0.2s forwards" : "fadeIn 0.2s ease-out" },
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 bg-black/40 backdrop-blur-sm",
				onClick: handleClose
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative bg-white rounded-3xl soft-shadow w-full max-w-[320px] overflow-hidden text-center flex flex-col items-center justify-center",
				style: { animation: isClosing ? "popOut 0.2s forwards" : "popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" },
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ jsxs("div", {
					className: "p-6 pb-5 w-full flex flex-col gap-2",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-extrabold text-black leading-tight",
						children: title
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm leading-relaxed text-muted-foreground",
						children: description
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "w-full flex border-t border-border/40",
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: handleClose,
							className: "flex-1 py-3.5 text-sm font-bold text-muted-foreground hover:bg-muted/50 transition cursor-pointer",
							children: cancelText
						}),
						/* @__PURE__ */ jsx("div", { className: "w-[1px] bg-border/40" }),
						/* @__PURE__ */ jsx("button", {
							onClick: handleConfirm,
							className: `flex-1 py-3.5 text-sm font-extrabold transition cursor-pointer ${variant === "danger" ? "text-red-500 hover:bg-red-50" : "text-cyan hover:bg-cyan/10"}`,
							children: confirmText
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes popIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes popOut { from { transform: scale(1); opacity: 1 } to { transform: scale(0.95); opacity: 0 } }
      ` })
		]
	}), document.body);
}
//#endregion
export { ConfirmModal as t };
