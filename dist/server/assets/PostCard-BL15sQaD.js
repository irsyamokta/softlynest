import { t as supabase } from "./supabase-DsUV4Div.js";
import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { n as deletePostFn } from "./post.server-S-YufaV0.js";
import { t as EmojiPicker } from "./EmojiPicker-CJFW-xdf.js";
import { t as ConfirmModal } from "./ConfirmModal-B6utst9w.js";
import { a as getCommentsFn, i as favoritePostFn, n as deleteCommentFn, s as likePostFn, t as commentPostFn } from "./interaction.server-CAIDaUKj.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Heart, MessageSquare, MoreHorizontal, Send, Star, Trash2, UserCircle2, X } from "lucide-react";
import { createPortal } from "react-dom";
import { formatDistanceToNow } from "date-fns";
//#region src/components/softly/CommentModal.tsx
function CommentModal({ post, onClose }) {
	const [comments, setComments] = useState([]);
	const [draft, setDraft] = useState("");
	const [isClosing, setIsClosing] = useState(false);
	const [loading, setLoading] = useState(true);
	const textareaRef = useRef(null);
	const { user } = useAuth();
	useEffect(() => {
		getCommentsFn({ data: post.id }).then((fetched) => {
			setComments(fetched);
			setLoading(false);
		});
		const channel = supabase.channel(`comments-${post.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "Comment"
		}, (payload) => {
			if (payload.new?.postId === post.id) getCommentsFn({ data: post.id }).then(setComments);
		}).on("postgres_changes", {
			event: "DELETE",
			schema: "public",
			table: "Comment"
		}, (payload) => {
			if (payload.old?.postId === post.id) setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [post.id]);
	const handleClose = () => {
		setIsClosing(true);
		setTimeout(onClose, 200);
	};
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") handleClose();
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);
	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 120) + "px";
	}, [draft]);
	const insertEmoji = (emoji) => {
		const el = textareaRef.current;
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
	const submit = async (e) => {
		e?.preventDefault();
		if (!draft.trim()) return;
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				toast.error("Please login to comment");
				return;
			}
			const text = draft;
			setDraft("");
			if (textareaRef.current) textareaRef.current.style.height = "auto";
			await commentPostFn({ data: {
				postId: post.id,
				userId: user.id,
				text
			} });
		} catch (err) {
			toast.error(err.message || "Failed to comment");
		}
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submit();
		}
	};
	return createPortal(/* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[100]",
		style: { animation: isClosing ? "fadeOut 0.2s forwards" : "fadeIn 0.2s ease-out" },
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 bg-black/40 backdrop-blur-sm",
				onClick: handleClose
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "absolute bottom-0 left-0 right-0 md:hidden bg-cream rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-10",
				style: { animation: isClosing ? "slideDownSheet 0.2s forwards" : "slideUpSheet 0.25s cubic-bezier(0.16, 1, 0.3, 1)" },
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/40 shrink-0",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-base font-extrabold",
							children: "Comments"
						}), /* @__PURE__ */ jsx("button", {
							onClick: handleClose,
							className: "p-1.5 rounded-full hover:bg-muted transition cursor-pointer",
							children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 overflow-y-auto px-4 py-3 space-y-3 chat-scroll",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-2xl p-3 border border-border/60 soft-shadow",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 mb-1.5",
									children: [/* @__PURE__ */ jsx("img", {
										src: post.avatar,
										alt: post.user,
										className: "w-8 h-8 rounded-full object-cover bg-muted shrink-0"
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-xs text-black",
										children: post.anonymous ? "Anonymous" : post.user
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[10px] text-muted-foreground",
										children: post.time
									})] })]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs leading-relaxed text-black whitespace-pre-line line-clamp-3",
									children: post.text
								})]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-4 mb-2 px-1",
								children: /* @__PURE__ */ jsx("p", {
									className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider",
									children: "Comments"
								})
							}),
							/* @__PURE__ */ jsx(CommentList, {
								comments,
								loading,
								currentUser: user
							})
						]
					}),
					/* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "bg-nest px-3 py-3 flex items-end gap-2 shrink-0",
						children: [
							/* @__PURE__ */ jsx(EmojiPicker, {
								onEmojiSelect: insertEmoji,
								buttonClassName: "text-cream/80 hover:text-white transition cursor-pointer p-2"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex-1 bg-cream rounded-3xl px-4 py-2.5 flex items-end min-h-[44px]",
								children: /* @__PURE__ */ jsx("textarea", {
									ref: textareaRef,
									value: draft,
									onChange: (e) => setDraft(e.target.value),
									onKeyDown: handleKeyDown,
									placeholder: "Add a kind comment…",
									rows: 1,
									style: {
										height: "auto",
										maxHeight: "120px"
									},
									className: "w-full bg-transparent text-sm outline-none resize-none leading-snug text-black placeholder:text-muted-foreground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
								})
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: !draft.trim(),
								"aria-label": "Send",
								className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${draft.trim() ? "bg-cyan text-white hover:bg-cyan/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed"}`,
								children: /* @__PURE__ */ jsx(Send, {
									className: "w-4 h-4",
									strokeWidth: 2.5
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute hidden md:flex inset-0 items-center justify-center p-8 z-10",
				onClick: handleClose,
				children: /* @__PURE__ */ jsxs("div", {
					className: "relative flex flex-col bg-cream rounded-3xl shadow-2xl w-full max-w-3xl max-h-full overflow-hidden",
					style: { animation: isClosing ? "popOut 0.2s forwards" : "popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" },
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsxs("header", {
							className: "flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/40 shrink-0",
							children: [/* @__PURE__ */ jsx("h1", {
								className: "text-xl font-extrabold",
								children: "Comments"
							}), /* @__PURE__ */ jsx("button", {
								onClick: handleClose,
								className: "p-1.5 rounded-full hover:bg-muted transition cursor-pointer",
								children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex-1 overflow-y-auto p-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 chat-scroll",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "sticky top-0 self-start bg-white rounded-3xl p-4 soft-shadow border border-border/60",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3 mb-2",
										children: [/* @__PURE__ */ jsx("img", {
											src: post.avatar,
											alt: post.user,
											className: "w-10 h-10 rounded-full object-cover bg-muted shrink-0"
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "font-bold text-sm text-black",
											children: post.anonymous ? "Anonymous" : post.user
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-muted-foreground",
											children: post.time
										})] })]
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm leading-relaxed whitespace-pre-line text-black",
										children: post.text
									}),
									post.image && /* @__PURE__ */ jsx("div", {
										className: "mt-3 rounded-2xl overflow-hidden",
										children: /* @__PURE__ */ jsx("img", {
											src: post.image,
											alt: "",
											className: "w-full aspect-[4/3] object-cover"
										})
									})
								]
							}), /* @__PURE__ */ jsx("ul", {
								className: "space-y-3",
								children: /* @__PURE__ */ jsx(CommentList, {
									comments,
									loading,
									currentUser: user
								})
							})]
						}),
						/* @__PURE__ */ jsxs("form", {
							onSubmit: submit,
							className: "bg-muted rounded-2xl mx-4 mb-4 px-3 py-3 flex items-end gap-2 shrink-0",
							children: [
								/* @__PURE__ */ jsx(EmojiPicker, {
									onEmojiSelect: insertEmoji,
									buttonClassName: "text-foreground/60 hover:text-cyan transition cursor-pointer p-2"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "flex-1 bg-white rounded-3xl px-4 py-2.5 flex items-end min-h-[44px]",
									children: /* @__PURE__ */ jsx("textarea", {
										ref: textareaRef,
										value: draft,
										onChange: (e) => setDraft(e.target.value),
										onKeyDown: handleKeyDown,
										placeholder: "Add a kind comment…",
										rows: 1,
										style: {
											height: "auto",
											maxHeight: "120px"
										},
										className: "w-full bg-transparent text-sm outline-none resize-none leading-snug text-black placeholder:text-muted-foreground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
									})
								}),
								/* @__PURE__ */ jsx("button", {
									type: "submit",
									disabled: !draft.trim(),
									"aria-label": "Send",
									className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${draft.trim() ? "bg-cyan text-white hover:bg-cyan/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed"}`,
									children: /* @__PURE__ */ jsx(Send, {
										className: "w-4 h-4",
										strokeWidth: 2.5
									})
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes slideUpSheet { from { transform: translateY(100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes slideDownSheet { from { transform: translateY(0); opacity: 1 } to { transform: translateY(100%); opacity: 0 } }
        @keyframes popIn { from { transform: scale(0.95) translateY(10px); opacity: 0 } to { transform: scale(1) translateY(0); opacity: 1 } }
        @keyframes popOut { from { transform: scale(1); opacity: 1 } to { transform: scale(0.95) translateY(10px); opacity: 0 } }
      ` })
		]
	}), document.body);
}
function CommentList({ comments, loading, currentUser }) {
	const [deletingCommentId, setDeletingCommentId] = useState(null);
	if (loading) return /* @__PURE__ */ jsx("li", {
		className: "text-xs text-muted-foreground text-center py-6",
		children: "Loading comments..."
	});
	const performDelete = async (commentId) => {
		try {
			await deleteCommentFn({ data: {
				commentId,
				userId: currentUser.id
			} });
			toast.success("Comment deleted");
		} catch (err) {
			toast.error(err.message || "Failed to delete comment");
		} finally {
			setDeletingCommentId(null);
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		comments.map((c) => /* @__PURE__ */ jsxs("li", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ jsx("img", {
				src: c.user?.avatar || "https://api.dicebear.com/9.x/thumbs/svg?seed=fallback",
				alt: c.user?.username,
				className: "w-9 h-9 rounded-full object-cover bg-muted shrink-0"
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 bg-muted rounded-2xl px-3 py-2 min-w-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-bold text-sm truncate text-black",
							children: c.user?.username
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[10px] text-muted-foreground shrink-0",
							children: formatDistanceToNow(new Date(c.createdAt))
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm leading-snug text-black",
						children: c.text
					}),
					currentUser?.user_metadata?.username === c.user?.username && /* @__PURE__ */ jsx("div", {
						className: "flex justify-end mt-1",
						children: /* @__PURE__ */ jsx("button", {
							onClick: () => setDeletingCommentId(c.id),
							className: "text-[11px] text-red-400 hover:text-red-500 font-semibold cursor-pointer px-1 py-0.5 rounded transition",
							children: "Delete"
						})
					})
				]
			})]
		}, c.id)),
		comments.length === 0 && /* @__PURE__ */ jsx("li", {
			className: "text-xs text-muted-foreground text-center py-6",
			children: "Be the first to leave something kind."
		}),
		deletingCommentId && /* @__PURE__ */ jsx(ConfirmModal, {
			title: "Delete comment?",
			description: "Are you sure you want to remove this comment?",
			confirmText: "Delete",
			variant: "danger",
			onClose: () => setDeletingCommentId(null),
			onConfirm: () => performDelete(deletingCommentId)
		})
	] });
}
//#endregion
//#region src/components/softly/PostCard.tsx
var formatCount = (count) => count > 99 ? "99+" : count;
function PostText({ text }) {
	return /* @__PURE__ */ jsx("p", {
		className: "text-sm leading-relaxed whitespace-pre-line text-black",
		children: text.split(/(#[\w\u00C0-\u017F]+)/g).map((part, i) => /^#[\w\u00C0-\u017F]+$/.test(part) ? /* @__PURE__ */ jsx(Link, {
			to: "/search",
			search: { q: part.slice(1) },
			className: "text-cyan font-semibold hover:underline",
			onClick: (e) => e.stopPropagation(),
			children: part
		}, i) : /* @__PURE__ */ jsx("span", { children: part }, i))
	});
}
function PostCard({ post }) {
	const { user } = useAuth();
	const currentUsername = user?.user_metadata?.username;
	const isOwnPost = currentUsername && post.user === currentUsername;
	const profileLink = isOwnPost ? "/profile" : "/user/$username";
	const profileParams = isOwnPost ? {} : { username: post.user };
	const [liked, setLiked] = useState(post.hasLiked ?? false);
	const [fav, setFav] = useState(post.hasFavorited ?? false);
	const [commentOpen, setCommentOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
	const [isDeleted, setIsDeleted] = useState(false);
	useEffect(() => {
		setLiked(post.hasLiked ?? false);
		setFav(post.hasFavorited ?? false);
	}, [post.hasLiked, post.hasFavorited]);
	const initialLikes = post._count?.likes ?? useMemo(() => post.text.length * 3 % 150, [post.text]);
	const initialFavs = post._count?.favorites ?? useMemo(() => post.text.length * 2 % 120, [post.text]);
	const commentCountState = post._count?.comments ?? 0;
	const [likeCount, setLikeCount] = useState(initialLikes);
	const [favCount, setFavCount] = useState(initialFavs);
	const [commentCount, setCommentCount] = useState(commentCountState);
	useEffect(() => {
		setLikeCount(post._count?.likes ?? initialLikes);
		setFavCount(post._count?.favorites ?? initialFavs);
		setCommentCount(post._count?.comments ?? 0);
	}, [
		post._count?.likes,
		post._count?.favorites,
		post._count?.comments
	]);
	const handleLike = async () => {
		const isLiking = !liked;
		setLiked(isLiking);
		setLikeCount((c) => isLiking ? c + 1 : c - 1);
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) throw new Error("Not logged in");
			await likePostFn({ data: {
				postId: post.id,
				userId: user.id,
				action: isLiking ? "like" : "unlike"
			} });
		} catch (err) {
			toast.error(err.message || "Failed to like");
			setLiked(!isLiking);
			setLikeCount((c) => isLiking ? c - 1 : c + 1);
		}
	};
	const handleFav = async () => {
		const isFaving = !fav;
		setFav(isFaving);
		setFavCount((c) => isFaving ? c + 1 : c - 1);
		try {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) throw new Error("Not logged in");
			await favoritePostFn({ data: {
				postId: post.id,
				userId: user.id,
				action: isFaving ? "favorite" : "unfavorite"
			} });
		} catch (err) {
			toast.error(err.message || "Failed to favorite");
			setFav(!isFaving);
			setFavCount((c) => isFaving ? c - 1 : c + 1);
		}
	};
	if (isDeleted) return null;
	return /* @__PURE__ */ jsxs("article", {
		className: "bg-white rounded-3xl p-4 soft-shadow border border-border/60",
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "flex items-center gap-3 mb-2 relative",
				children: [
					post.anonymous ? /* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-full bg-pink flex items-center justify-center shrink-0",
						children: /* @__PURE__ */ jsx(UserCircle2, { className: "w-7 h-7 text-white" })
					}) : /* @__PURE__ */ jsx(Link, {
						to: profileLink,
						params: profileParams,
						className: "shrink-0",
						children: /* @__PURE__ */ jsx("img", {
							src: post.avatar,
							alt: post.user,
							className: "w-10 h-10 rounded-full object-cover bg-muted hover:opacity-80 transition"
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "flex-1 min-w-0",
						children: /* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline gap-2",
							children: [post.anonymous ? /* @__PURE__ */ jsx("span", {
								className: "font-bold text-sm text-black",
								children: "Anonymous"
							}) : /* @__PURE__ */ jsx(Link, {
								to: profileLink,
								params: profileParams,
								className: "font-bold text-sm text-black hover:underline",
								children: post.user
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: post.time
							})]
						})
					}),
					isOwnPost && /* @__PURE__ */ jsxs("div", {
						className: "relative",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setMenuOpen(!menuOpen),
							className: "p-1.5 rounded-full hover:bg-muted transition text-muted-foreground cursor-pointer",
							"aria-label": "Post options",
							children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "w-5 h-5" })
						}), menuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
							className: "fixed inset-0 z-40",
							onClick: () => setMenuOpen(false)
						}), /* @__PURE__ */ jsx("div", {
							className: "absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-border/40 p-1 z-50",
							children: /* @__PURE__ */ jsxs("button", {
								onClick: () => {
									setMenuOpen(false);
									setConfirmDeleteOpen(true);
								},
								className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer text-left",
								children: [/* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }), "Delete"]
							})
						})] })]
					})
				]
			}),
			/* @__PURE__ */ jsx(PostText, { text: post.text }),
			post.video ? /* @__PURE__ */ jsx("div", {
				className: "relative mt-3 rounded-2xl overflow-hidden bg-black",
				children: /* @__PURE__ */ jsx("video", {
					src: post.video,
					controls: true,
					className: "w-full max-h-[400px] object-contain"
				})
			}) : post.image ? /* @__PURE__ */ jsx("div", {
				className: "relative mt-3 rounded-2xl overflow-hidden",
				children: /* @__PURE__ */ jsx("img", {
					src: post.image,
					alt: "",
					className: "w-full aspect-[4/3] object-cover"
				})
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "flex justify-end gap-2 mt-3",
				children: [
					/* @__PURE__ */ jsxs("button", {
						onClick: handleLike,
						"aria-label": "Like",
						className: `relative w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${liked ? "bg-pink text-cream" : "bg-pink/15 text-pink"}`,
						children: [/* @__PURE__ */ jsx(Heart, {
							className: "w-4.5 h-4.5",
							fill: liked ? "currentColor" : "none",
							strokeWidth: 2.5
						}), likeCount > 0 && /* @__PURE__ */ jsx("span", {
							className: "absolute -top-1.5 -right-1 flex min-w-[16px] h-4 px-1 items-center justify-center rounded-full bg-pink text-[9px] font-bold text-white ring-2 ring-white",
							children: formatCount(likeCount)
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setCommentOpen(true),
						"aria-label": "Comment",
						className: "relative w-9 h-9 rounded-full bg-cyan text-primary-foreground flex items-center justify-center cursor-pointer",
						children: [/* @__PURE__ */ jsx(MessageSquare, {
							className: "w-4.5 h-4.5",
							strokeWidth: 2.5
						}), commentCount > 0 && /* @__PURE__ */ jsx("span", {
							className: "absolute -top-1.5 -right-1 flex min-w-[16px] h-4 px-1 items-center justify-center rounded-full bg-cyan text-[9px] font-bold text-white ring-2 ring-white",
							children: formatCount(commentCount)
						})]
					}),
					/* @__PURE__ */ jsxs("button", {
						onClick: handleFav,
						"aria-label": "Favorite",
						className: `relative w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${fav ? "bg-yellow text-accent-foreground" : "bg-yellow/30 text-yellow"}`,
						children: [/* @__PURE__ */ jsx(Star, {
							className: "w-4.5 h-4.5",
							fill: fav ? "currentColor" : "none",
							strokeWidth: 2.5
						}), favCount > 0 && /* @__PURE__ */ jsx("span", {
							className: "absolute -top-1.5 -right-1 flex min-w-[16px] h-4 px-1 items-center justify-center rounded-full bg-yellow text-[9px] font-bold text-white ring-2 ring-white",
							children: formatCount(favCount)
						})]
					})
				]
			}),
			commentOpen && /* @__PURE__ */ jsx(CommentModal, {
				post,
				onClose: () => setCommentOpen(false)
			}),
			confirmDeleteOpen && /* @__PURE__ */ jsx(ConfirmModal, {
				title: "Delete post?",
				description: "This action cannot be undone. Your post and all its comments will be removed.",
				confirmText: "Delete",
				variant: "danger",
				onClose: () => setConfirmDeleteOpen(false),
				onConfirm: async () => {
					try {
						setIsDeleted(true);
						await deletePostFn({ data: {
							postId: post.id,
							userId: user.id
						} });
						toast.success("Post deleted");
					} catch (err) {
						setIsDeleted(false);
						toast.error(err.message || "Failed to delete post");
					}
				}
			})
		]
	});
}
//#endregion
export { PostCard as t };
