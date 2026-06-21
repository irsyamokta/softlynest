import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { i as getFavoritesFn } from "./post.server-S-YufaV0.js";
import { t as PostCard } from "./PostCard-BL15sQaD.js";
import { t as EmptyState } from "./EmptyState-CzJlrCAg.js";
import { t as useFeedRealtime } from "./useFeedRealtime-BGGNMzPF.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
//#region src/routes/_shell.favorites.tsx?tsr-split=component
function Favorites() {
	const { user } = useAuth();
	const { data: favorites, isLoading } = useQuery({
		queryKey: ["favorites", user?.id],
		queryFn: () => getFavoritesFn({ data: user.id }),
		enabled: !!user?.id
	});
	useFeedRealtime(user?.id);
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 py-4 md:px-0 md:py-0 space-y-4",
		children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
			className: "text-xl md:text-2xl font-extrabold",
			children: "Your favorites"
		}), /* @__PURE__ */ jsx("p", {
			className: "text-xs text-muted-foreground mt-1",
			children: "Posts you've starred to revisit."
		})] }), isLoading ? /* @__PURE__ */ jsx("div", {
			className: "flex justify-center p-8",
			children: /* @__PURE__ */ jsx(Loader2, { className: "w-8 h-8 text-cyan animate-spin" })
		}) : favorites?.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
			icon: Star,
			title: "No favorites yet",
			description: "You haven't favorited any posts. Click the star icon on a post you like to save it here."
		}) : /* @__PURE__ */ jsx("div", {
			className: "columns-1 md:columns-2 gap-4",
			children: favorites?.map((p) => {
				return /* @__PURE__ */ jsx("div", {
					className: "break-inside-avoid mb-4",
					children: /* @__PURE__ */ jsx(PostCard, { post: {
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
