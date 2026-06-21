import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { o as Star } from "./_libs/lucide-react.mjs";
import { i as getFavoritesFn } from "./_ssr/post.server-DCbf_Hu9.mjs";
import { t as formatDistanceToNow } from "./_libs/date-fns.mjs";
import { n as PostCardSkeleton, t as PostCard } from "./_ssr/PostCard-DhwzqZuJ.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-CzJlrCAg.mjs";
import { t as useFeedRealtime } from "./_ssr/useFeedRealtime-BGGNMzPF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.favorites-DYK_PTed.js
var import_jsx_runtime = require_jsx_runtime();
function Favorites() {
	const { user } = useAuth();
	const { data: favorites, isLoading } = useQuery({
		queryKey: ["favorites", user?.id],
		queryFn: () => getFavoritesFn({ data: user.id }),
		enabled: !!user?.id
	});
	useFeedRealtime(user?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4 md:px-0 md:py-0 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl md:text-2xl font-extrabold",
			children: "Your favorites"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-1",
			children: "Posts you've starred to revisit."
		})] }), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "columns-1 md:columns-2 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "break-inside-avoid mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "break-inside-avoid mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "break-inside-avoid mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {})
				})
			]
		}) : favorites?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: Star,
			title: "No favorites yet",
			description: "You haven't favorited any posts. Click the star icon on a post you like to save it here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "columns-1 md:columns-2 gap-4",
			children: favorites?.map((p) => {
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
		})]
	});
}
//#endregion
export { Favorites as component };
