import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { t as EmptyState } from "./EmptyState-CzJlrCAg.js";
import { n as getChatContactsFn, o as searchUsersFn } from "./auth.server-C3pOWsG0.js";
import { t as getConversationsFn } from "./message.server-DMm0u0Ia.js";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Search, Trash2, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
//#region src/hooks/useDebounce.ts
function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debouncedValue;
}
//#endregion
//#region src/routes/_shell.messages.tsx?tsr-split=component
function SwipeableMessage({ m, onDelete }) {
	const [offset, setOffset] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const startX = useRef(null);
	const hasMoved = useRef(false);
	const navigate = useNavigate();
	const onPointerDown = (e) => {
		if (e.button !== 0 && e.pointerType === "mouse") return;
		e.currentTarget.setPointerCapture(e.pointerId);
		startX.current = e.clientX;
		hasMoved.current = false;
		setIsDragging(false);
	};
	const onPointerMove = (e) => {
		if (startX.current === null) return;
		const diff = e.clientX - startX.current;
		if (Math.abs(diff) > 8) {
			hasMoved.current = true;
			setIsDragging(true);
		}
		if (diff < 0) setOffset(Math.max(diff, -120));
		else setOffset(0);
	};
	const onPointerUp = (e) => {
		e.currentTarget.releasePointerCapture(e.pointerId);
		if (!hasMoved.current) navigate({
			to: "/messages/$messageId",
			params: { messageId: m.username }
		});
		else if (offset <= -80) onDelete();
		else setOffset(0);
		startX.current = null;
		hasMoved.current = false;
		setIsDragging(false);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "relative overflow-hidden rounded-2xl mb-2.5",
		children: [
			offset < -10 && /* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 bg-red-500 flex items-center justify-end px-5 rounded-2xl",
				children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5 text-white" })
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: onDelete,
				className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer z-10",
				"aria-label": "Delete conversation",
				children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
			}),
			/* @__PURE__ */ jsxs("div", {
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp,
				style: {
					transform: `translateX(${offset}px)`,
					transition: isDragging ? "none" : "transform 0.25s ease-out",
					cursor: isDragging ? "grabbing" : "pointer"
				},
				className: "flex items-center gap-3 bg-cream rounded-2xl px-3 py-3 soft-shadow border border-border/60 select-none hover:brightness-[0.97] transition-all relative z-10",
				children: [
					/* @__PURE__ */ jsx("img", {
						src: m.avatar,
						alt: m.user,
						className: "w-11 h-11 rounded-full object-cover bg-muted shrink-0 pointer-events-none"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0 pointer-events-none",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-bold text-sm truncate",
								children: m.user
							}), /* @__PURE__ */ jsx("span", {
								className: "text-[10px] text-muted-foreground shrink-0",
								children: m.latestMessage?.createdAt ? formatDistanceToNow(new Date(m.latestMessage.createdAt), { addSuffix: true }) : ""
							})]
						}), /* @__PURE__ */ jsx("p", {
							className: `text-xs truncate ${m.unreadCount > 0 ? "font-bold text-black" : "text-foreground/80"}`,
							children: m.latestMessage?.withdrawn ? /* @__PURE__ */ jsx("span", {
								className: "italic text-muted-foreground",
								children: "🚫 This message was withdrawn"
							}) : m.latestMessage?.text || m.preview || ""
						})]
					}),
					m.unreadCount > 0 && /* @__PURE__ */ jsx("span", {
						className: "flex items-center justify-center w-5 h-5 rounded-full bg-cyan text-white text-[10px] font-bold shrink-0 pointer-events-none",
						children: m.unreadCount
					})
				]
			})
		]
	});
}
function Messages() {
	const { user } = useAuth();
	const isChatRoomActive = useMatchRoute()({
		to: "/messages/$messageId",
		fuzzy: true
	});
	const [searchQuery, setSearchQuery] = useState("");
	const debouncedSearch = useDebounce(searchQuery, 500);
	const { data: searchResults } = useQuery({
		queryKey: ["search-users", debouncedSearch],
		queryFn: () => searchUsersFn({ data: {
			query: debouncedSearch,
			currentUserId: user?.id
		} }),
		enabled: !!user?.id && debouncedSearch.length > 0
	});
	const { data: messages = [] } = useQuery({
		queryKey: ["conversations", user?.id],
		queryFn: () => getConversationsFn({ data: user.id }),
		enabled: !!user?.id,
		refetchInterval: 3e3
	});
	const { data: contacts } = useQuery({
		queryKey: ["chat-contacts", user?.id],
		queryFn: () => getChatContactsFn({ data: user.id }),
		enabled: !!user?.id && messages.length === 0
	});
	const handleDelete = (id) => {
		console.log("Delete conversation", id);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col lg:flex-row flex-1 min-h-0 w-full md:overflow-hidden md:rounded-3xl md:border md:border-border/40 shadow-none md:shadow-xl md:shadow-black/5 bg-cream md:bg-white/50",
		children: [/* @__PURE__ */ jsx("div", {
			className: `w-full flex-col min-h-0 border-r border-border/40 bg-cream lg:w-[350px] md:bg-transparent ${isChatRoomActive ? "hidden lg:flex" : "flex"}`,
			children: /* @__PURE__ */ jsxs("div", {
				className: "px-4 py-4 lg:py-6 flex-1 overflow-y-auto",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "text-2xl font-extrabold mb-4 px-1",
						children: "Messages"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "relative mb-6",
						children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
							type: "text",
							placeholder: "Search users to chat...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "w-full pl-10 pr-4 py-2.5 bg-white border border-border/40 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-shadow soft-shadow"
						})]
					}),
					searchQuery ? /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsx("div", {
							className: "px-1 mb-2",
							children: /* @__PURE__ */ jsx("p", {
								className: "text-sm font-bold text-black",
								children: "Search Results"
							})
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: searchResults?.length ? searchResults.map((u) => /* @__PURE__ */ jsxs(Link, {
								to: "/messages/$messageId",
								params: { messageId: u.username },
								className: "flex items-center gap-3 bg-white hover:bg-black/5 transition rounded-2xl px-3 py-3 soft-shadow border border-border/60",
								children: [/* @__PURE__ */ jsx("img", {
									src: u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}`,
									alt: u.username,
									className: "w-10 h-10 rounded-full object-cover shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-sm text-black truncate",
										children: u.displayName || u.username
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground truncate",
										children: ["@", u.username]
									})]
								})]
							}, u.id)) : /* @__PURE__ */ jsx("p", {
								className: "text-sm text-muted-foreground text-center py-4",
								children: "No users found."
							})
						})]
					}) : messages.length > 0 ? messages.map((m) => /* @__PURE__ */ jsx(SwipeableMessage, {
						m,
						onDelete: () => handleDelete(m.id)
					}, m.id)) : contacts && contacts.length > 0 ? /* @__PURE__ */ jsxs("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "px-1 mb-2",
							children: [/* @__PURE__ */ jsxs("p", {
								className: "text-sm font-bold text-black flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Users, { className: "w-4 h-4 text-cyan" }), " Start a new chat"]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Select a friend to message."
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-2",
							children: contacts.map((c) => /* @__PURE__ */ jsxs(Link, {
								to: "/messages/$messageId",
								params: { messageId: c.username },
								className: "flex items-center gap-3 bg-white hover:bg-black/5 transition rounded-2xl px-3 py-3 soft-shadow border border-border/60",
								children: [/* @__PURE__ */ jsx("img", {
									src: c.avatar,
									alt: c.username,
									className: "w-10 h-10 rounded-full object-cover shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60"
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ jsx("p", {
										className: "font-bold text-sm text-black truncate",
										children: c.displayName
									}), /* @__PURE__ */ jsxs("p", {
										className: "text-xs text-muted-foreground truncate",
										children: ["@", c.username]
									})]
								})]
							}, c.id))
						})]
					}) : /* @__PURE__ */ jsx(EmptyState, {
						icon: MessageSquare,
						title: "No messages yet",
						description: "Your inbox is quiet. Start a conversation by finding someone to message.",
						action: /* @__PURE__ */ jsx(Link, {
							to: "/search",
							search: { q: "" },
							className: "inline-block mt-2 px-6 py-2.5 rounded-full bg-cyan text-white font-bold text-sm hover:bg-cyan/90 transition shadow-sm",
							children: "Find people"
						})
					})
				]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: `flex-1 min-h-0 flex flex-col bg-cream lg:bg-transparent overflow-hidden ${isChatRoomActive ? "flex" : "hidden lg:flex"}`,
			children: /* @__PURE__ */ jsx(Outlet, {})
		})]
	});
}
//#endregion
export { Messages as component };
