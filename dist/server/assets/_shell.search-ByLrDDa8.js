import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { l as searchPostsFn, r as getExploreFeedFn } from "./post.server-S-YufaV0.js";
import { t as Route } from "./_shell.search-BbKcS77L.js";
import { t as PostCard } from "./PostCard-BL15sQaD.js";
import { t as EmptyState } from "./EmptyState-CzJlrCAg.js";
import { t as useFeedRealtime } from "./useFeedRealtime-BGGNMzPF.js";
import { o as searchUsersFn } from "./auth.server-C3pOWsG0.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Compass, Hash, Search, SearchX, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
//#region src/routes/_shell.search.tsx?tsr-split=component
function SearchPage() {
	const hashtags = Route.useLoaderData();
	const { q: initialQ } = Route.useSearch();
	const [query, setQuery] = useState(initialQ || "");
	const [tab, setTab] = useState("posts");
	const [results, setResults] = useState([]);
	const [userResults, setUserResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const { user } = useAuth();
	const { data: explorePosts, isLoading: isLoadingExplore } = useQuery({
		queryKey: ["explore-feed", user?.id],
		queryFn: () => getExploreFeedFn({ data: { userId: user?.id } }),
		enabled: !query
	});
	useFeedRealtime(user?.id);
	useEffect(() => {
		setQuery(initialQ || "");
	}, [initialQ]);
	useEffect(() => {
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
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "hidden md:block text-2xl font-extrabold mb-4",
				children: "What is on your mind today?"
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "md:hidden text-xl font-extrabold mb-3",
				children: "What is on your mind today?"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ jsx("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search posts, users, hashtags…",
					className: "w-full bg-muted rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan text-foreground placeholder:text-muted-foreground"
				})]
			}),
			query && /* @__PURE__ */ jsxs("div", {
				className: "flex gap-2 mt-4 bg-nest-foreground/5 p-1 rounded-full w-fit",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setTab("posts"),
					className: `px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${tab === "posts" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"}`,
					children: "Posts"
				}), /* @__PURE__ */ jsx("button", {
					onClick: () => setTab("users"),
					className: `px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${tab === "users" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"}`,
					children: "Users"
				})]
			}),
			!query && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2 mt-4",
				children: hashtags.slice(0, 10).map((h) => /* @__PURE__ */ jsxs("button", {
					onClick: () => setQuery(h.name),
					className: "text-xs font-bold px-3 py-1.5 rounded-full bg-cyan/20 text-foreground hover:bg-cyan/40 transition cursor-pointer",
					children: ["#", h.name]
				}, h.id))
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-4 text-muted-foreground",
					children: [/* @__PURE__ */ jsx(Compass, { className: "w-5 h-5" }), /* @__PURE__ */ jsx("h3", {
						className: "font-bold text-sm",
						children: "Explore"
					})]
				}), isLoadingExplore ? /* @__PURE__ */ jsx("div", {
					className: "flex justify-center p-8",
					children: /* @__PURE__ */ jsx("div", { className: "animate-pulse w-8 h-8 rounded-full bg-cyan/20" })
				}) : explorePosts && explorePosts.length > 0 ? /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: explorePosts.map((p) => {
						return /* @__PURE__ */ jsx(PostCard, { post: {
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
					})
				}) : /* @__PURE__ */ jsx(EmptyState, {
					icon: Hash,
					title: "Explore Softlynest",
					description: "Discover new people, thoughts, and conversations. Try searching for a topic or click a hashtag above."
				})]
			})] }),
			query && tab === "posts" && /* @__PURE__ */ jsx("div", {
				className: "mt-6 space-y-4",
				children: loading ? /* @__PURE__ */ jsx("p", {
					className: "text-center text-sm font-bold text-muted-foreground",
					children: "Searching posts..."
				}) : results.length > 0 ? results.map((p) => {
					return /* @__PURE__ */ jsx(PostCard, { post: {
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
				}) : /* @__PURE__ */ jsx(EmptyState, {
					icon: SearchX,
					title: "No posts found",
					description: `We couldn't find any posts matching "${query}".`
				})
			}),
			query && tab === "users" && /* @__PURE__ */ jsx("div", {
				className: "mt-6 space-y-3",
				children: loading ? /* @__PURE__ */ jsx("p", {
					className: "text-center text-sm font-bold text-muted-foreground",
					children: "Searching users..."
				}) : userResults.length > 0 ? userResults.map((u) => {
					const avatarUrl = u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;
					return /* @__PURE__ */ jsxs(Link, {
						to: "/user/$username",
						params: { username: u.username },
						className: "flex items-center gap-3 py-3 px-4 bg-white rounded-2xl border border-border/60 hover:bg-black/5 transition",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60",
							children: /* @__PURE__ */ jsx("img", {
								src: avatarUrl,
								alt: u.username,
								className: "w-full h-full object-cover"
							})
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-bold text-sm text-black truncate",
								children: u.displayName
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-xs text-muted-foreground truncate",
								children: ["@", u.username]
							})]
						})]
					}, u.id);
				}) : /* @__PURE__ */ jsx(EmptyState, {
					icon: Users,
					title: "No users found",
					description: `We couldn't find anyone with the name "${query}".`
				})
			}),
			/* @__PURE__ */ jsx("div", { className: "h-4" })
		]
	});
}
//#endregion
export { SearchPage as component };
