import { t as supabase } from "./supabase-DsUV4Div.js";
import { t as createPostFn } from "./post.server-S-YufaV0.js";
import { t as EmojiPicker } from "./EmojiPicker-CJFW-xdf.js";
import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { ImagePlus, UserCircle2, X } from "lucide-react";
//#region src/routes/_shell.post.tsx?tsr-split=component
function PostPage() {
	const [text, setText] = useState("");
	const [media, setMedia] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const textareaRef = useRef(null);
	const fileInputRef = useRef(null);
	const insertEmoji = (emoji) => {
		const el = textareaRef.current;
		if (!el) {
			setText((v) => v + emoji);
			return;
		}
		const start = el.selectionStart ?? text.length;
		const end = el.selectionEnd ?? text.length;
		setText(text.slice(0, start) + emoji + text.slice(end));
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(start + emoji.length, start + emoji.length);
		});
	};
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 10 * 1024 * 1024) {
			toast.error("File is too large. Max 10MB allowed.");
			return;
		}
		const type = file.type.startsWith("video/") ? "video" : "image";
		setMedia({
			url: URL.createObjectURL(file),
			type,
			file
		});
	};
	const removeMedia = () => {
		if (media) URL.revokeObjectURL(media.url);
		setMedia(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const fileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};
	const handlePost = async (anonymous) => {
		try {
			setLoading(true);
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				toast.error("Please login to post");
				return;
			}
			let imageBase64;
			let videoBase64;
			if (media) {
				toast.loading("Uploading media...", { id: "post-upload" });
				const b64 = await fileToBase64(media.file);
				if (media.type === "image") imageBase64 = b64;
				else videoBase64 = b64;
			}
			toast.loading("Creating post...", { id: "post-upload" });
			await createPostFn({ data: {
				userId: user.id,
				text,
				imageBase64,
				videoBase64,
				anonymous
			} });
			toast.success("Posted successfully!", { id: "post-upload" });
			navigate({ to: "/home" });
		} catch (err) {
			toast.error(err.message || "Failed to create post", { id: "post-upload" });
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 py-4 flex flex-col h-full",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-xl font-extrabold mb-3",
				children: "Share something soft"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "bg-white border border-border/60 soft-shadow rounded-3xl p-4 flex-1 flex flex-col min-h-[260px]",
				children: [
					/* @__PURE__ */ jsx("textarea", {
						ref: textareaRef,
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "What's on your mind today? Use #hashtags to get discovered!",
						className: "w-full flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-muted-foreground text-black min-h-[120px]"
					}),
					(() => {
						const tags = text.match(/#[\w\u00C0-\u017F]+/g);
						return tags && tags.length > 0 ? /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-1.5 mt-2",
							children: [...new Set(tags)].map((tag) => /* @__PURE__ */ jsx("span", {
								className: "text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan/15 text-cyan",
								children: tag
							}, tag))
						}) : null;
					})(),
					media && /* @__PURE__ */ jsxs("div", {
						className: "relative mt-2 rounded-xl overflow-hidden self-start",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: removeMedia,
							className: "absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition z-10",
							children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
						}), media.type === "video" ? /* @__PURE__ */ jsx("video", {
							src: media.url,
							className: "max-h-[200px] object-cover",
							controls: true
						}) : /* @__PURE__ */ jsx("img", {
							src: media.url,
							alt: "",
							className: "max-h-[200px] object-cover"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 mt-auto pt-2 border-t border-border/40",
						children: [
							/* @__PURE__ */ jsx(EmojiPicker, {
								onEmojiSelect: insertEmoji,
								buttonClassName: "text-muted-foreground hover:text-cyan transition cursor-pointer p-1.5"
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => fileInputRef.current?.click(),
								className: "inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer",
								children: [/* @__PURE__ */ jsx(ImagePlus, { className: "w-4 h-4" }), " Add image or video"]
							}),
							/* @__PURE__ */ jsx("input", {
								type: "file",
								accept: "image/*,video/*",
								className: "hidden",
								ref: fileInputRef,
								onChange: handleFileChange
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-[11px] text-muted-foreground mt-3 leading-relaxed",
				children: "Likes are hidden on every post so you can share freely. You'll still see who supports you in your notifications."
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-2 mt-4",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => handlePost(false),
					disabled: !text.trim() && !media || loading,
					className: "rounded-full bg-cyan text-primary-foreground font-bold py-3 disabled:opacity-40",
					children: loading ? "Posting..." : "Post"
				}), /* @__PURE__ */ jsxs("button", {
					onClick: () => handlePost(true),
					disabled: !text.trim() && !media || loading,
					className: "rounded-full bg-pink/15 text-pink font-bold py-3 inline-flex items-center justify-center gap-2 disabled:opacity-40",
					children: [
						/* @__PURE__ */ jsx(UserCircle2, { className: "w-4 h-4" }),
						" ",
						loading ? "Posting..." : "Post Anonymously"
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", { className: "h-4" })
		]
	});
}
//#endregion
export { PostPage as component };
