import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { t as Route } from "./post._id-72e6KcD6.js";
import { s as getPostFn } from "./post.server-S-YufaV0.js";
import { t as EmojiPicker } from "./EmojiPicker-CJFW-xdf.js";
import { a as getCommentsFn } from "./interaction.server-CAIDaUKj.js";
import { t as PostCard } from "./PostCard-BL15sQaD.js";
import { t as EmptyState } from "./EmptyState-CzJlrCAg.js";
import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
//#region src/routes/post.$id.tsx?tsr-split=component
function PostDetail() {
	const { id } = Route.useParams();
	const { user } = useAuth();
	const { data: post, isLoading: postLoading } = useQuery({
		queryKey: [
			"post",
			id,
			user?.id
		],
		queryFn: () => getPostFn({ data: {
			postId: id,
			userId: user?.id
		} })
	});
	const { data: comments = [], isLoading: commentsLoading } = useQuery({
		queryKey: ["comments", id],
		queryFn: () => getCommentsFn({ data: id })
	});
	const [draft, setDraft] = useState("");
	const inputRef = useRef(null);
	const insertEmoji = (emoji) => {
		const el = inputRef.current;
		if (!el) {
			setDraft((v) => v + emoji);
			return;
		}
		const start = el.selectionStart ?? draft.length;
		const end = el.selectionEnd ?? draft.length;
		setDraft(draft.slice(0, start) + emoji + draft.slice(end));
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(start + emoji.length, start + emoji.length);
		});
	};
	const submit = (e) => {
		e.preventDefault();
		if (!draft.trim()) return;
		setDraft("");
	};
	user?.user_metadata?.avatar_url || `${user?.user_metadata?.username || "user"}`;
	if (postLoading) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-cream flex items-center justify-center",
		children: "Loading..."
	});
	if (!post) return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen bg-nest flex items-center justify-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-cream rounded-3xl p-8 text-center",
			children: [/* @__PURE__ */ jsx("p", {
				className: "font-bold",
				children: "Post not found."
			}), /* @__PURE__ */ jsx(Link, {
				to: "/home",
				className: "mt-4 inline-block text-cyan font-bold",
				children: "Back to home"
			})]
		})
	});
	const mappedPost = {
		id: post.id,
		user: post.user.username,
		avatar: post.user.avatar || "",
		time: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
		text: post.text,
		image: post.image || void 0,
		video: post.video || void 0,
		anonymous: post.anonymous,
		_count: post._count,
		hasLiked: post.hasLiked,
		hasFavorited: post.hasFavorited
	};
	const commentsList = /* @__PURE__ */ jsx("ul", {
		className: "space-y-3",
		children: comments.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: MessageCircle,
			title: "No comments yet",
			description: "Be the first to share a kind thought."
		}) : comments.map((c) => /* @__PURE__ */ jsxs("li", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ jsx("img", {
				src: c.user.avatar,
				alt: c.user.username,
				className: "w-9 h-9 rounded-full object-cover bg-muted shrink-0"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 bg-muted rounded-2xl px-3 py-2 min-w-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold text-sm truncate text-black",
							children: c.user.username
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-muted-foreground shrink-0",
							children: formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm leading-snug text-black",
						children: c.text
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 mt-1 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ jsxs("button", {
							className: "inline-flex items-center gap-1 hover:text-pink",
							children: [/* @__PURE__ */ jsx(Heart, { className: "w-3.5 h-3.5" }), " 0"]
						}), /* @__PURE__ */ jsx("button", {
							className: "hover:text-foreground font-semibold",
							children: "Reply"
						})]
					})
				]
			})]
		}, c.id))
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "min-h-screen w-full bg-cream flex flex-col md:hidden",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-center gap-3 px-5 pt-6 pb-3",
				children: [/* @__PURE__ */ jsx(Link, {
					to: "/home",
					className: "p-1",
					"aria-label": "Back",
					children: /* @__PURE__ */ jsx(ArrowLeft, {
						className: "w-6 h-6",
						strokeWidth: 2.5
					})
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-lg font-extrabold",
					children: "Comments"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 overflow-y-auto px-4 pb-4 space-y-4",
				children: [/* @__PURE__ */ jsx(PostCard, { post: mappedPost }), commentsList]
			}),
			/* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "bg-nest px-3 py-3 flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsx(EmojiPicker, {
						onEmojiSelect: insertEmoji,
						buttonClassName: "text-cream/80 hover:text-white transition cursor-pointer p-2"
					}),
					/* @__PURE__ */ jsx("input", {
						ref: inputRef,
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Add a kind comment…",
						className: "flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none text-black"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						"aria-label": "Send",
						className: "w-10 h-10 rounded-full bg-cyan text-primary-foreground flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ jsx(Send, {
							className: "w-4 h-4",
							strokeWidth: 2.5
						})
					})
				]
			})
		]
	}), /* @__PURE__ */ jsx("div", {
		className: "hidden md:flex fixed inset-0 z-50 items-center justify-center bg-black/50 backdrop-blur-sm p-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-cream rounded-3xl soft-shadow w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden",
			children: [
				/* @__PURE__ */ jsxs("header", {
					className: "flex items-center gap-3 px-6 pt-5 pb-3 border-b border-border/40 shrink-0",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/home",
						className: "p-1 hover:text-cyan transition",
						"aria-label": "Back",
						children: /* @__PURE__ */ jsx(ArrowLeft, {
							className: "w-5 h-5",
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ jsx("h1", {
						className: "text-xl font-extrabold",
						children: "Comments"
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex-1 overflow-y-auto p-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "sticky top-0 self-start",
						children: /* @__PURE__ */ jsx(PostCard, { post: mappedPost })
					}), commentsList]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "bg-muted rounded-2xl mx-4 mb-4 px-3 py-3 flex items-center gap-2 shrink-0",
					children: [
						/* @__PURE__ */ jsx(EmojiPicker, {
							onEmojiSelect: insertEmoji,
							buttonClassName: "text-foreground/60 hover:text-cyan transition cursor-pointer p-2"
						}),
						/* @__PURE__ */ jsx("input", {
							ref: inputRef,
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Add a kind comment…",
							className: "flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none text-black"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							"aria-label": "Send",
							className: "w-10 h-10 rounded-full bg-cyan text-primary-foreground flex items-center justify-center shrink-0",
							children: /* @__PURE__ */ jsx(Send, {
								className: "w-4 h-4",
								strokeWidth: 2.5
							})
						})
					]
				})
			]
		})
	})] });
}
//#endregion
export { PostDetail as component };
