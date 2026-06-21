import { o as __toESM } from "./_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { _ as Link, f as useMatchRoute, p as Outlet, y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as getChatContactsFn, o as searchUsersFn } from "./_ssr/auth.server-BroEg_wp.mjs";
import { t as getConversationsFn } from "./_ssr/message.server-BQK5dIW0.mjs";
import { a as Trash2, h as MessageSquare, n as Users, u as Search } from "./_libs/lucide-react.mjs";
import { t as formatDistanceToNow } from "./_libs/date-fns.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-CzJlrCAg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.messages-BMB6hS8l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = (0, import_react.useState)(value);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debouncedValue;
}
function SwipeableMessage({ m, onDelete }) {
	useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl mb-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onDelete,
			className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer z-10",
			"aria-label": "Delete conversation",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/messages/$messageId",
			params: { messageId: m.username },
			className: "flex items-center gap-3 bg-cream rounded-2xl px-3 py-3 soft-shadow border border-border/60 hover:bg-black/5 transition relative z-10 group",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: m.avatar,
					alt: m.user,
					className: "w-11 h-11 rounded-full object-cover bg-muted shrink-0 pointer-events-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0 pointer-events-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-sm truncate",
							children: m.user
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground shrink-0",
							children: m.latestMessage?.createdAt ? formatDistanceToNow(new Date(m.latestMessage.createdAt), { addSuffix: true }) : ""
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-xs truncate ${m.unreadCount > 0 ? "font-bold text-black" : "text-foreground/80"}`,
						children: m.latestMessage?.withdrawn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "italic text-muted-foreground",
							children: "🚫 This message was withdrawn"
						}) : m.latestMessage?.text || m.preview || ""
					})]
				}),
				m.unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex items-center justify-center w-5 h-5 rounded-full bg-cyan text-white text-[10px] font-bold shrink-0 pointer-events-none",
					children: m.unreadCount
				})
			]
		})]
	});
}
function Messages() {
	const { user } = useAuth();
	const isChatRoomActive = useMatchRoute()({
		to: "/messages/$messageId",
		fuzzy: true
	});
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col lg:flex-row flex-1 min-h-0 w-full md:overflow-hidden md:rounded-3xl md:border md:border-border/40 shadow-none md:shadow-xl md:shadow-black/5 bg-cream md:bg-white/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `w-full flex-col min-h-0 border-r border-border/40 bg-cream lg:w-[350px] md:bg-transparent ${isChatRoomActive ? "hidden lg:flex" : "flex"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 py-4 lg:py-6 flex-1 overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-extrabold mb-4 px-1",
						children: "Messages"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search users to chat...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "w-full pl-10 pr-4 py-2.5 bg-white border border-border/40 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-shadow soft-shadow"
						})]
					}),
					searchQuery ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-1 mb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-black",
								children: "Search Results"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: searchResults?.length ? searchResults.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/messages/$messageId",
								params: { messageId: u.username },
								className: "flex items-center gap-3 bg-white hover:bg-black/5 transition rounded-2xl px-3 py-3 soft-shadow border border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}`,
									alt: u.username,
									className: "w-10 h-10 rounded-full object-cover shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-sm text-black truncate",
										children: u.displayName || u.username
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: ["@", u.username]
									})]
								})]
							}, u.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground text-center py-4",
								children: "No users found."
							})
						})]
					}) : messages.length > 0 ? messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwipeableMessage, {
						m,
						onDelete: () => handleDelete(m.id)
					}, m.id)) : contacts && contacts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-1 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-bold text-black flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-cyan" }), " Start a new chat"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Select a friend to message."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: contacts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/messages/$messageId",
								params: { messageId: c.username },
								className: "flex items-center gap-3 bg-white hover:bg-black/5 transition rounded-2xl px-3 py-3 soft-shadow border border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: c.avatar,
									alt: c.username,
									className: "w-10 h-10 rounded-full object-cover shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-bold text-sm text-black truncate",
										children: c.displayName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: ["@", c.username]
									})]
								})]
							}, c.id))
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: MessageSquare,
						title: "No messages yet",
						description: "Your inbox is quiet. Start a conversation by finding someone to message.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/search",
							search: { q: "" },
							className: "inline-block mt-2 px-6 py-2.5 rounded-full bg-cyan text-white font-bold text-sm hover:bg-cyan/90 transition shadow-sm",
							children: "Find people"
						})
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `flex-1 min-h-0 flex flex-col bg-cream lg:bg-transparent overflow-hidden ${isChatRoomActive ? "flex" : "hidden lg:flex"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})]
	});
}
//#endregion
export { Messages as component };
