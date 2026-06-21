import { t as supabase } from "./supabase-DsUV4Div.js";
import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { c as markAllNotificationsReadFn, l as markNotificationReadFn, o as getNotificationsFn, r as deleteNotificationFn } from "./interaction.server-CAIDaUKj.js";
import { t as EmptyState } from "./EmptyState-CzJlrCAg.js";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
//#region src/components/softly/NotificationsContent.tsx
function SwipeableNotification({ n, onDelete, onRead }) {
	const [offset, setOffset] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const startX = useRef(null);
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
	return /* @__PURE__ */ jsxs("div", {
		className: "relative overflow-hidden rounded-3xl mb-3 group",
		children: [
			offset < -10 && /* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 bg-red-500 flex items-center justify-end px-5 rounded-3xl",
				children: /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5 text-white" })
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: onDelete,
				className: "absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer z-10",
				"aria-label": "Delete notification",
				children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
			}),
			/* @__PURE__ */ jsxs("li", {
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
					/* @__PURE__ */ jsx(Link, {
						to: "/user/$username",
						params: { username: n.user },
						className: "w-10 h-10 rounded-full bg-gradient-to-br from-pink/60 to-yellow/60 shrink-0 overflow-hidden",
						onClick: (e) => {
							e.stopPropagation();
							onRead();
						},
						children: n.avatar ? /* @__PURE__ */ jsx("img", {
							src: n.avatar,
							alt: n.user,
							className: "w-full h-full object-cover"
						}) : null
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 text-sm leading-snug min-w-0",
						children: [
							/* @__PURE__ */ jsx(Link, {
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
							/* @__PURE__ */ jsx("span", {
								className: "text-black",
								children: n.action
							}),
							n.detail && /* @__PURE__ */ jsxs("span", {
								className: "text-black",
								children: [" ", n.detail]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: n.time
							})
						]
					}),
					n.unread && /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-cyan shrink-0" })
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
	useEffect(() => {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-extrabold",
					children: "Notifications"
				}), notifications.some((n) => n.read === false) && /* @__PURE__ */ jsx("button", {
					onClick: markAllAsRead,
					className: "text-sm font-bold text-cyan hover:opacity-80 transition cursor-pointer",
					children: "Mark all as read"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3",
				children: "Recent"
			}),
			loading ? /* @__PURE__ */ jsx("div", {
				className: "text-center py-10 text-muted-foreground",
				children: /* @__PURE__ */ jsx("p", { children: "Loading notifications..." })
			}) : notifications.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
				icon: Bell,
				title: "No notifications",
				description: "You're all caught up! When someone interacts with you, you'll see it here."
			}) : /* @__PURE__ */ jsx("ul", { children: notifications.map((n) => {
				return /* @__PURE__ */ jsx(SwipeableNotification, {
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
			/* @__PURE__ */ jsx("div", { className: "h-2" })
		]
	});
}
//#endregion
//#region src/routes/_shell.notifications.tsx?tsr-split=component
function Notifications() {
	return /* @__PURE__ */ jsx("div", {
		className: "w-full",
		children: /* @__PURE__ */ jsx(NotificationsContent, {})
	});
}
//#endregion
export { Notifications as component };
