import { o as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/supabase-DsUV4Div.mjs";
import { a as require_jsx_runtime, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as X, v as ImagePlus, w as CircleUserRound } from "./_libs/lucide-react.mjs";
import { t as createPostFn } from "./_ssr/post.server-DCbf_Hu9.mjs";
import { t as EmojiPicker } from "./_ssr/EmojiPicker-CJFW-xdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.post-CkAYhrQb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PostPage() {
	const [text, setText] = (0, import_react.useState)("");
	const [media, setMedia] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const textareaRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
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
		const isVideo = file.type.startsWith("video/");
		if (isVideo && file.size > 10 * 1024 * 1024) {
			toast.error("Video is too large. Max 10MB allowed.");
			e.target.value = "";
			return;
		} else if (!isVideo && file.size > 10 * 1024 * 1024) {
			toast.error("Image is too large. Max 10MB allowed.");
			e.target.value = "";
			return;
		}
		if (isVideo) {
			const url = URL.createObjectURL(file);
			const tempVideo = document.createElement("video");
			tempVideo.preload = "metadata";
			tempVideo.src = url;
			tempVideo.onloadedmetadata = () => {
				URL.revokeObjectURL(url);
				if (tempVideo.duration > 60) {
					toast.error("Video is too long. Max 1 minute (60 seconds) allowed.");
					if (fileInputRef.current) fileInputRef.current.value = "";
					return;
				}
				setMedia({
					url: URL.createObjectURL(file),
					type: "video",
					file
				});
			};
			tempVideo.onerror = () => {
				URL.revokeObjectURL(url);
				toast.error("Could not read video file. Please try another file.");
				if (fileInputRef.current) fileInputRef.current.value = "";
			};
			return;
		}
		setMedia({
			url: URL.createObjectURL(file),
			type: "image",
			file
		});
	};
	const removeMedia = () => {
		if (media) URL.revokeObjectURL(media.url);
		setMedia(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const compressImage = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event) => {
				const img = new Image();
				img.src = event.target?.result;
				img.onload = () => {
					const canvas = document.createElement("canvas");
					let width = img.width;
					let height = img.height;
					const MAX_WIDTH = 1200;
					const MAX_HEIGHT = 1200;
					if (width > height) {
						if (width > MAX_WIDTH) {
							height = Math.round(height * MAX_WIDTH / width);
							width = MAX_WIDTH;
						}
					} else if (height > MAX_HEIGHT) {
						width = Math.round(width * MAX_HEIGHT / height);
						height = MAX_HEIGHT;
					}
					canvas.width = width;
					canvas.height = height;
					const ctx = canvas.getContext("2d");
					if (!ctx) {
						resolve(event.target?.result);
						return;
					}
					ctx.drawImage(img, 0, 0, width, height);
					resolve(canvas.toDataURL("image/jpeg", .7));
				};
				img.onerror = (err) => reject(err);
			};
			reader.onerror = (err) => reject(err);
		});
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
				if (media.type === "image") imageBase64 = await compressImage(media.file);
				else videoBase64 = await fileToBase64(media.file);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4 flex flex-col h-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-extrabold mb-3",
				children: "Share something soft"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border border-border/60 soft-shadow rounded-3xl p-4 flex-1 flex flex-col min-h-[260px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						ref: textareaRef,
						value: text,
						onChange: (e) => setText(e.target.value),
						placeholder: "What's on your mind today? Use #hashtags to get discovered!",
						className: "w-full flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-muted-foreground text-black min-h-[120px]"
					}),
					(() => {
						const tags = text.match(/#[\w\u00C0-\u017F]+/g);
						return tags && tags.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5 mt-2",
							children: [...new Set(tags)].map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan/15 text-cyan",
								children: tag
							}, tag))
						}) : null;
					})(),
					media && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mt-2 rounded-xl overflow-hidden self-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: removeMedia,
							className: "absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition z-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
						}), media.type === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: media.url,
							className: "max-h-[200px] object-cover",
							controls: true
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: media.url,
							alt: "",
							className: "max-h-[200px] object-cover"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mt-auto pt-2 border-t border-border/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmojiPicker, {
								onEmojiSelect: insertEmoji,
								buttonClassName: "text-muted-foreground hover:text-cyan transition cursor-pointer p-1.5"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => fileInputRef.current?.click(),
								className: "inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "w-4 h-4" }), " Add image or video"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground mt-3 leading-relaxed",
				children: "Likes are hidden on every post so you can share freely. You'll still see who supports you in your notifications."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-2 mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => handlePost(false),
					disabled: !text.trim() && !media || loading,
					className: "rounded-full bg-cyan text-primary-foreground font-bold py-3 disabled:opacity-40 cursor-pointer",
					children: loading ? "Posting..." : "Post"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => handlePost(true),
					disabled: !text.trim() && !media || loading,
					className: "rounded-full bg-pink/15 text-pink font-bold py-3 inline-flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleUserRound, { className: "w-4 h-4" }),
						" ",
						loading ? "Posting..." : "Post Anonymously"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4" })
		]
	});
}
//#endregion
export { PostPage as component };
