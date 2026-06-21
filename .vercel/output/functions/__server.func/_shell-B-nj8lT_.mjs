import { o as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/supabase-DsUV4Div.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { _ as Link, f as useMatchRoute, l as useLocation, p as Outlet, y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as getNotificationsFn } from "./_ssr/interaction.server-CsngiMQ2.mjs";
import { s as syncUserToPrismaFn } from "./_ssr/auth.server-BroEg_wp.mjs";
import { r as getUnreadMessagesCountFn } from "./_ssr/message.server-BQK5dIW0.mjs";
import { n as playNotificationSound, t as playMessageSound } from "./_ssr/sounds-DDZlDPLE.mjs";
import { t as Logo } from "./_ssr/Logo-4c3S_ikB.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { S as Ellipsis, T as Bell, _ as LogOut, c as Settings, m as Plus, o as Star, r as User } from "./_libs/lucide-react.mjs";
import { a as TiHome, i as BsChatTextFill, n as RiSearchLine, o as TiHomeOutline, r as BsChatText, t as RiSearchFill } from "./_libs/react-icons.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell-B-nj8lT_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PhoneFrame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-[100dvh] w-full bg-cream",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[100dvh] w-full bg-cream flex flex-col",
			children
		})
	});
}
function TopBar() {
	const [dropdownOpen, setDropdownOpen] = (0, import_react.useState)(false);
	const dropdownRef = (0, import_react.useRef)(null);
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const { data: notifications, refetch } = useQuery({
		queryKey: ["notifications", user?.id],
		queryFn: () => getNotificationsFn({ data: user.id }),
		enabled: !!user?.id
	});
	const unreadCount = notifications?.filter((n) => !n.read).length || 0;
	(0, import_react.useEffect)(() => {
		if (user?.id) {
			const channel = supabase.channel(`topbar-notifications-${user.id}`).on("postgres_changes", {
				event: "INSERT",
				schema: "public",
				table: "Notification"
			}, (payload) => {
				if (payload.new?.userId === user.id) {
					refetch();
					if (payload.new.actorId !== user.id) {
						toast("You have a new notification!");
						playNotificationSound();
					}
				}
			}).subscribe();
			return () => {
				supabase.removeChannel(channel);
			};
		}
	}, [user?.id, refetch]);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleLogout = async () => {
		setDropdownOpen(false);
		await signOut();
		navigate({ to: "/" });
	};
	const username = user?.user_metadata?.username || "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between px-5 pt-5 pb-3 bg-cream",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				ref: dropdownRef,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setDropdownOpen(!dropdownOpen),
					"aria-label": "Profile menu",
					className: "block cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-10 h-10 rounded-full ring-2 ring-cream overflow-hidden bg-gradient-to-br from-pink to-yellow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: user?.user_metadata?.avatar_url || `https://api.dicebear.com/9.x/thumbs/svg?seed=${username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`,
							alt: username,
							className: "w-full h-full object-cover"
						})
					})
				}), dropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-12 left-0 w-48 bg-white rounded-2xl soft-shadow py-2 border border-border/40 z-50 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-2.5 border-b border-border/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-black truncate",
								children: username
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground truncate",
								children: user?.email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							onClick: () => setDropdownOpen(false),
							className: "flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-muted transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
								className: "w-4 h-4 text-cyan",
								strokeWidth: 2.5
							}), "Profile"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/settings",
							onClick: () => setDropdownOpen(false),
							className: "flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-muted transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
								className: "w-4 h-4 text-cyan",
								strokeWidth: 2.5
							}), "Settings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-pink hover:bg-pink/10 transition cursor-pointer text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
								className: "w-4 h-4",
								strokeWidth: 2.5
							}), "Log out"]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/notifications",
				"aria-label": "Notifications",
				className: "relative text-gray-400 hover:text-gray-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
					className: "w-7 h-7",
					strokeWidth: 2.5,
					fill: "currentColor"
				}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute top-0 right-0 flex h-2.5 w-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-pink ring-2 ring-cream" })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-nest-foreground rounded-full px-5 py-1.5 shadow-sm",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: "sm" })
		})]
	});
}
var items$1 = [
	{
		to: "/home",
		label: "Home",
		icon: TiHomeOutline,
		activeIcon: TiHome
	},
	{
		to: "/search",
		label: "Search",
		icon: RiSearchLine,
		activeIcon: RiSearchFill
	},
	{
		to: "/post",
		label: "Post",
		icon: Plus,
		center: true
	},
	{
		to: "/favorites",
		label: "Favorites",
		icon: Star
	},
	{
		to: "/messages",
		label: "Messages",
		icon: BsChatText,
		activeIcon: BsChatTextFill
	}
];
function BottomNav() {
	const { pathname } = useLocation();
	const { user } = useAuth();
	const { data: unreadMessagesCount = 0 } = useQuery({
		queryKey: ["unread-messages", user?.id],
		queryFn: () => getUnreadMessagesCountFn({ data: user.id }),
		enabled: !!user?.id,
		refetchInterval: 5e3
	});
	const prevUnreadRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const prev = prevUnreadRef.current;
		if (prev > 0 && unreadMessagesCount > prev) playMessageSound();
		prevUnreadRef.current = unreadMessagesCount;
	}, [unreadMessagesCount]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "sticky bottom-0 z-20 bg-nest px-4 pt-3 pb-4 rounded-t-3xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex items-center justify-around",
			children: items$1.map(({ to, label, icon: Icon, activeIcon: ActiveIcon, center }) => {
				const active = pathname === to || pathname.startsWith(to + "/");
				const RenderIcon = active && ActiveIcon ? ActiveIcon : Icon;
				if (center) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to,
					"aria-label": label,
					className: "flex items-center justify-center w-14 h-14 rounded-full bg-cyan text-primary-foreground -mt-8 ring-4 ring-nest shadow-lg active:scale-95 transition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderIcon, {
						className: "w-7 h-7",
						strokeWidth: 2.5
					})
				}) }, to);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					"aria-label": label,
					className: `relative flex items-center justify-center w-11 h-11 rounded-full transition ${active ? "text-white" : "text-cream/90 hover:text-cream"}`,
					children: [to === "/messages" || to === "/home" || to === "/search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderIcon, { className: "w-6 h-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderIcon, {
						className: "w-6 h-6",
						strokeWidth: active ? 0 : 2.5,
						fill: active ? "currentColor" : "none"
					}), to === "/messages" && unreadMessagesCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink text-[8px] font-bold text-white ring-2 ring-nest",
						children: unreadMessagesCount
					})]
				}) }, to);
			})
		})
	});
}
var items = [
	{
		to: "/home",
		label: "Home",
		icon: TiHomeOutline,
		activeIcon: TiHome
	},
	{
		to: "/search",
		label: "Search",
		icon: RiSearchLine,
		activeIcon: RiSearchFill
	},
	{
		to: "/favorites",
		label: "Favorites",
		icon: Star
	},
	{
		to: "/messages",
		label: "Messages",
		icon: BsChatText,
		activeIcon: BsChatTextFill
	},
	{
		to: "/notifications",
		label: "Notifications",
		icon: Bell
	}
];
function SideNav() {
	const { pathname } = useLocation();
	const [dropdownOpen, setDropdownOpen] = (0, import_react.useState)(false);
	const dropdownRef = (0, import_react.useRef)(null);
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	useQueryClient();
	const { data: notifications, refetch } = useQuery({
		queryKey: ["notifications", user?.id],
		queryFn: () => getNotificationsFn({ data: user.id }),
		enabled: !!user?.id
	});
	const { data: unreadMessagesCount = 0 } = useQuery({
		queryKey: ["unread-messages", user?.id],
		queryFn: () => getUnreadMessagesCountFn({ data: user.id }),
		enabled: !!user?.id,
		refetchInterval: 5e3
	});
	const unreadNotificationsCount = notifications?.filter((n) => !n.read).length || 0;
	(0, import_react.useEffect)(() => {
		if (!user?.id) return;
		const channel = supabase.channel(`sidenav-notifications-${user.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "Notification"
		}, (payload) => {
			if (payload.new?.userId === user.id) {
				refetch();
				playNotificationSound();
			}
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user?.id, refetch]);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleLogout = async (e) => {
		e.preventDefault();
		setDropdownOpen(false);
		await signOut();
		navigate({ to: "/" });
	};
	const displayName = user?.user_metadata?.username || "You";
	const displayHandle = user?.user_metadata?.username ? `@${user.user_metadata.username}` : "@you.softly";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-cream text-nest-foreground p-5 gap-2 sticky top-0 h-screen border-r border-nest-foreground/10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-nest-foreground rounded-full px-5 py-1.5 self-start mb-4 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: "sm" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1",
					children: items.map(({ to, label, icon: Icon, activeIcon: ActiveIcon }) => {
						const active = pathname === to || pathname.startsWith(to + "/");
						const RenderIcon = active && ActiveIcon ? ActiveIcon : Icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to,
							className: `flex items-center gap-3 px-4 py-2.5 rounded-full font-bold text-sm transition ${active ? "bg-cyan text-white" : "text-black hover:bg-black/5"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									to === "/messages" || to === "/home" || to === "/search" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderIcon, { className: "w-[22px] h-[22px]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderIcon, {
										className: "w-5 h-5",
										strokeWidth: 2.5,
										fill: active ? "currentColor" : "none"
									}),
									to === "/notifications" && unreadNotificationsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "absolute -top-1 -right-1 flex h-2 w-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-pink" })]
									}),
									to === "/messages" && unreadMessagesCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink text-[9px] font-bold text-white ring-2 ring-cream",
										children: unreadMessagesCount
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
						}) }, to);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/post",
					className: "mt-4 flex items-center justify-center gap-2 rounded-full bg-pink text-cream font-bold py-3 hover:opacity-90 transition",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "w-5 h-5",
						strokeWidth: 2.5
					}), " New post"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-auto mb-4",
				ref: dropdownRef,
				children: [dropdownOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-14 left-0 w-full bg-white rounded-2xl soft-shadow py-2 border border-border/40 z-50 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							onClick: () => setDropdownOpen(false),
							className: "flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-muted transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, {
								className: "w-4 h-4 text-cyan",
								strokeWidth: 2.5
							}), "Profile"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/settings",
							onClick: () => setDropdownOpen(false),
							className: "flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-muted transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {
								className: "w-4 h-4 text-cyan",
								strokeWidth: 2.5
							}), "Settings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleLogout,
							className: "w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-pink hover:bg-pink/10 transition cursor-pointer text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {
								className: "w-4 h-4",
								strokeWidth: 2.5
							}), "Log out"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setDropdownOpen(!dropdownOpen),
					className: "w-full flex items-center gap-3 p-2 rounded-full hover:bg-black/5 transition cursor-pointer text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-pink to-yellow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: user?.user_metadata?.avatar_url || `https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.user_metadata?.username || "user"}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`,
								alt: displayName,
								className: "w-full h-full object-cover"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-bold text-black truncate",
								children: displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground truncate",
								children: displayHandle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "w-5 h-5 text-muted-foreground mr-2 shrink-0" })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-nest-foreground/60 px-2",
				children: "© Softlynest — a soft place to land."
			})
		]
	});
}
function useAppBadge() {
	const { user } = useAuth();
	const { data: unreadMessagesCount = 0 } = useQuery({
		queryKey: ["unread-messages", user?.id],
		queryFn: () => getUnreadMessagesCountFn({ data: user.id }),
		enabled: !!user?.id,
		refetchInterval: 5e3
	});
	const { data: notifications = [] } = useQuery({
		queryKey: ["notifications", user?.id],
		queryFn: () => getNotificationsFn({ data: user.id }),
		enabled: !!user?.id
	});
	const unreadNotificationsCount = notifications.filter((n) => !n.read).length || 0;
	(0, import_react.useEffect)(() => {
		const totalUnread = unreadMessagesCount + unreadNotificationsCount;
		if ("setAppBadge" in navigator) if (totalUnread > 0) navigator.setAppBadge(totalUnread).catch((error) => {
			console.error("Failed to set app badge", error);
		});
		else navigator.clearAppBadge().catch((error) => {
			console.error("Failed to clear app badge", error);
		});
	}, [unreadMessagesCount, unreadNotificationsCount]);
}
function ShellLayout() {
	const matchRoute = useMatchRoute();
	const isChatRoomActive = matchRoute({
		to: "/messages/$messageId",
		fuzzy: true
	});
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	useAppBadge();
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/" });
	}, [
		user,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!loading && user) {
			const email = user.email || "";
			const username = user.user_metadata?.username || email.split("@")[0] || "user";
			syncUserToPrismaFn({ data: {
				id: user.id,
				email,
				username
			} }).catch((err) => {
				console.error("Shell layout user sync error:", err);
			});
		}
	}, [user, loading]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		const channel = supabase.channel("global-presence", { config: { presence: { key: user.id } } });
		channel.on("presence", { event: "sync" }, () => {
			const state = channel.presenceState();
			queryClient.setQueryData(["global-presence"], state);
		}).subscribe(async (status) => {
			if (status === "SUBSCRIBED") await channel.track({ online_at: (/* @__PURE__ */ new Date()).toISOString() });
		});
		return () => {
			supabase.removeChannel(channel);
		};
	}, [user, queryClient]);
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex-1 w-full flex items-center justify-center bg-white",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/favicon.svg",
			alt: "Loading",
			className: "w-16 h-16 animate-pulse"
		})
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-1 h-full w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideNav, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col min-w-0 bg-cream",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `md:hidden shrink-0 z-50 ${isChatRoomActive ? "hidden" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 overflow-y-auto bg-cream relative flex flex-col",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-full md:max-w-5xl md:mx-auto md:px-6 md:py-8 flex flex-col flex-1 min-h-full ${isChatRoomActive || matchRoute({
							to: "/messages",
							fuzzy: true
						}) ? "" : "pb-6"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `md:hidden shrink-0 z-50 ${isChatRoomActive ? "hidden" : ""}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomNav, {})
				})
			]
		})]
	}) });
}
//#endregion
export { ShellLayout as component };
