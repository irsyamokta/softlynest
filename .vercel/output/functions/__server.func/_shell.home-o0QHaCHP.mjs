import { a as require_jsx_runtime, n as useQuery } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { x as Ghost } from "./_libs/lucide-react.mjs";
import { a as getFeedFn } from "./_ssr/post.server-DCbf_Hu9.mjs";
import { t as formatDistanceToNow } from "./_libs/date-fns.mjs";
import { n as PostCardSkeleton, t as PostCard } from "./_ssr/PostCard-DhwzqZuJ.mjs";
import { t as EmptyState } from "./_ssr/EmptyState-CzJlrCAg.mjs";
import { t as useFeedRealtime } from "./_ssr/useFeedRealtime-BGGNMzPF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.home-o0QHaCHP.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user } = useAuth();
	const { data: posts, isLoading } = useQuery({
		queryKey: ["feed", user?.id],
		queryFn: () => getFeedFn({ data: { userId: user?.id } })
	});
	useFeedRealtime(user?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "hidden md:block text-2xl font-extrabold mb-4",
				children: "Your feed"
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCardSkeleton, {})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: posts?.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Ghost,
					title: "Nothing to see here",
					description: "Your feed is as quiet as a whisper. Follow some friends or be the first to share your thoughts today."
				}) : posts?.map((p) => {
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
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2" })
		]
	});
}
//#endregion
export { Home as component };
