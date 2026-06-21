import { o as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/supabase-DsUV4Div.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { c as markAllNotificationsReadFn, l as markNotificationReadFn, o as getNotificationsFn, r as deleteNotificationFn } from "./_ssr/interaction.server-Sw9oPGY2.mjs";
import { T as Bell, a as Trash2 } from "./_libs/lucide-react.mjs";
import { t as formatDistanceToNow } from "./_libs/date-fns.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-CzJlrCAg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.notifications-DIfbDQIv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SwipeableNotification({ n, onDelete, onRead }) {
	const [offset, setOffset] = (0, import_react.useState)(0);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const startX = (0, import_react.useRef)(null);
	const onPointerDown = (e) => {
		e.target.setPointerCapture(e.pointerId);
		startX.current = e.clientX;
		setIsDragging(true);
	};
	const onPointerMove = (e) => {
		if (startX.current === null) return;
		const diff = e.clientX - startX.current;
		if (diff < 0) setOffset(Math.max(diff, -120));
		else setOffset(0);
	};
	const onPointerUp = (e) => {
		e.target.releasePointerCapture(e.pointerId);
		if (offset <= -80) onDelete();
		else setOffset(0);
		startX.current = null;
		setIsDragging(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-3xl mb-3 group",
		children: [
			offset < -10 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-red-500 flex items-center justify-end px-5 rounded-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-5 h-5 text-white" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onDelete,
				className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer z-10",
				"aria-label": "Delete notification",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				onPointerDown,
				onPointerMove,
				onPointerUp,
				onPointerCancel: onPointerUp,
				style: {
					transform: `translateX(${offset}px)`,
					transition: isDragging ? "none" : "transform 0.25s ease-out",
					cursor: isDragging ? "grabbing" : "pointer"
				},
				className: "relative flex items-center gap-3 bg-white p-4 rounded-3xl soft-shadow border border-border/60 select-none hover:brightness-[0.97] transition-all z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/user/$username",
						params: { username: n.user },
						className: "w-10 h-10 rounded-full bg-gradient-to-br from-pink/60 to-yellow/60 shrink-0 overflow-hidden",
						onClick: (e) => {
							e.stopPropagation();
							onRead();
						},
						children: n.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: n.avatar,
							alt: n.user,
							className: "w-full h-full object-cover"
						}) : null
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 text-sm leading-snug min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/user/$username",
								params: { username: n.user },
								className: "font-bold text-black hover:underline",
								onClick: (e) => {
									e.stopPropagation();
									onRead();
								},
								children: n.user
							}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-black",
								children: n.action
							}),
							n.detail && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-black",
								children: [" ", n.detail]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: n.time
							})
						]
					}),
					n.unread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2.5 h-2.5 rounded-full bg-cyan shrink-0" })
				]
			})
		]
	});
}
function NotificationsContent() {
	const { user, loading: authLoading } = useAuth();
	const queryClient = useQueryClient();
	const { data: notifications = [], isLoading: loading, refetch } = useQuery({
		queryKey: ["notifications", user?.id],
		queryFn: () => getNotificationsFn({ data: user.id }),
		enabled: !!user?.id
	});
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		const channel = supabase.channel(`notifications-page-${user.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "Notification"
		}, (payload) => {
			if (payload.new?.userId === user.id) refetch();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user?.id, refetch]);
	const handleMarkRead = (id) => {
		if (!user?.id) return;
		queryClient.setQueryData(["notifications", user.id], (old) => old?.map((n) => n.id === id ? {
			...n,
			read: true
		} : n) ?? []);
		markNotificationReadFn({ data: id }).catch(() => {
			queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
		});
	};
	const handleDelete = (id) => {
		if (!user?.id) return;
		queryClient.setQueryData(["notifications", user?.id], (old) => old?.filter((n) => n.id !== id) ?? []);
		deleteNotificationFn({ data: {
			notificationId: id,
			userId: user.id
		} }).catch(() => {
			queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
		});
	};
	const markAllAsRead = () => {
		if (!user?.id) return;
		markAllNotificationsReadFn({ data: user.id }).then(() => {
			queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-extrabold",
					children: "Notifications"
				}), notifications.some((n) => n.read === false) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: markAllAsRead,
					className: "text-sm font-bold text-cyan hover:opacity-80 transition cursor-pointer",
					children: "Mark all as read"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3",
				children: "Recent"
			}),
			loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: [
					1,
					2,
					3,
					4
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 bg-white p-4 rounded-3xl soft-shadow border border-border/60 animate-pulse",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-10 rounded-full bg-nest-foreground/10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 bg-nest-foreground/10 rounded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-16 bg-nest-foreground/10 rounded" })]
					})]
				}, i))
			}) : notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: Bell,
				title: "No notifications",
				description: "You're all caught up! When someone interacts with you, you'll see it here."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: notifications.map((n) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwipeableNotification, {
					n: {
						id: n.id,
						user: n.actor.username,
						avatar: n.actor.avatar || "",
						action: n.type === "LIKE" ? "liked your post" : n.type === "COMMENT" ? "commented on your post" : "followed you",
						detail: "",
						time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }),
						unread: !n.read
					},
					onDelete: () => handleDelete(n.id),
					onRead: () => handleMarkRead(n.id)
				}, n.id);
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2" })
		]
	});
}
function Notifications() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsContent, {})
	});
}
//#endregion
export { Notifications as component };
