import { o as __toESM } from "./_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as searchUsersFn } from "./_ssr/auth.server-BroEg_wp.mjs";
import { C as Compass, b as Hash, d as SearchX, n as Users, u as Search } from "./_libs/lucide-react.mjs";
import { l as searchPostsFn, r as getExploreFeedFn } from "./_ssr/post.server-DCbf_Hu9.mjs";
import { t as formatDistanceToNow } from "./_libs/date-fns.mjs";
import { n as PostCardSkeleton, t as PostCard } from "./_ssr/PostCard-DhwzqZuJ.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-CzJlrCAg.mjs";
import { t as useFeedRealtime } from "./_ssr/useFeedRealtime-BGGNMzPF.mjs";
import { t as Route } from "./_shell.search-mDlsw5KN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.search-CiS-ppb3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const hashtags = Route.useLoaderData();
	const { q: initialQ } = Route.useSearch();
	const [query, setQuery] = (0, import_react.useState)(initialQ || "");
	const [tab, setTab] = (0, import_react.useState)("posts");
	const [results, setResults] = (0, import_react.useState)([]);
	const [userResults, setUserResults] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const { user } = useAuth();
	const { data: explorePosts, isLoading: isLoadingExplore } = useQuery({
		queryKey: ["explore-feed", user?.id],
		queryFn: () => getExploreFeedFn({ data: { userId: user?.id } }),
		enabled: !query
	});
	useFeedRealtime(user?.id);
	(0, import_react.useEffect)(() => {
		setQuery(initialQ || "");
	}, [initialQ]);
	(0, import_react.useEffect)(() => {
		if (!query) {
			setResults([]);
			setUserResults([]);
			return;
		}
		const timer = setTimeout(async () => {
			setLoading(true);
			if (tab === "posts") setResults(await searchPostsFn({ data: {
				query,
				userId: user?.id
			} }));
			else setUserResults(await searchUsersFn({ data: {
				query,
				currentUserId: user?.id
			} }));
			setLoading(false);
		}, 500);
		return () => clearTimeout(timer);
	}, [
		query,
		tab,
		user?.id
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "hidden md:block text-2xl font-extrabold mb-4",
				children: "What is on your mind today?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "md:hidden text-xl font-extrabold mb-3",
				children: "What is on your mind today?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search posts, users, hashtags…",
					className: "w-full bg-muted rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan text-foreground placeholder:text-muted-foreground"
				})]
			}),
			query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 mt-4 bg-nest-foreground/5 p-1 rounded-full w-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab("posts"),
					className: `px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${tab === "posts" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"}`,
					children: "Posts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab("users"),
					className: `px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${tab === "users" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"}`,
					children: "Users"
				})]
			}),
			!query && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2 mt-4",
				children: hashtags.slice(0, 10).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setQuery(h.name),
					className: "text-xs font-bold px-3 py-1.5 rounded-full bg-cyan/20 text-foreground hover:bg-cyan/40 transition cursor-pointer",
					children: ["#", h.name]
				}, h.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 mb-4 text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-sm",
						children: "Explore"
					})]
				}), isLoadingExplore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:columns-2 md:gap-4",
					children: [
						1,
						2,
						3,
						4
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "break-inside-avoid mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {})
					}, i))
				}) : explorePosts && explorePosts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:columns-2 md:gap-4",
					children: explorePosts.map((p) => {
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "break-inside-avoid mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { post: {
								id: p.id,
								user: p.user.username,
								avatar: p.user.avatar || "",
								time: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
								text: p.text,
								image: p.image || void 0,
								video: p.video || void 0,
								anonymous: p.anonymous,
								_count: p._count,
								hasLiked: p.hasLiked,
								hasFavorited: p.hasFavorited
							} })
						}, p.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Hash,
					title: "Explore Softlynest",
					description: "Discover new people, thoughts, and conversations. Try searching for a topic or click a hashtag above."
				})]
			})] }),
			query && tab === "posts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-4",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {})
					]
				}) : results.length > 0 ? results.map((p) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { post: {
						id: p.id,
						user: p.user.username,
						avatar: p.user.avatar || "",
						time: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
						text: p.text,
						image: p.image || void 0,
						video: p.video || void 0,
						anonymous: p.anonymous,
						_count: p._count,
						hasLiked: p.hasLiked,
						hasFavorited: p.hasFavorited
					} }, p.id);
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: SearchX,
					title: "No posts found",
					description: `We couldn't find any posts matching "${query}".`
				})
			}),
			query && tab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-3",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: [
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 py-3 px-4 bg-white rounded-2xl border border-border/60 animate-pulse",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-11 h-11 rounded-full bg-nest-foreground/10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-24 bg-nest-foreground/10 rounded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-16 bg-nest-foreground/10 rounded" })]
						})]
					}, i))
				}) : userResults.length > 0 ? userResults.map((u) => {
					const avatarUrl = u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/user/$username",
						params: { username: u.username },
						className: "flex items-center gap-3 py-3 px-4 bg-white rounded-2xl border border-border/60 hover:bg-black/5 transition",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: avatarUrl,
								alt: u.username,
								className: "w-full h-full object-cover"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-sm text-black truncate",
								children: u.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground truncate",
								children: ["@", u.username]
							})]
						})]
					}, u.id);
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Users,
					title: "No users found",
					description: `We couldn't find anyone with the name "${query}".`
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4" })
		]
	});
}
//#endregion
export { SearchPage as component };
