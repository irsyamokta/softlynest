import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { a as getFeedFn } from "./post.server-S-YufaV0.js";
import { t as PostCard } from "./PostCard-BL15sQaD.js";
import { t as EmptyState } from "./EmptyState-CzJlrCAg.js";
import { t as useFeedRealtime } from "./useFeedRealtime-BGGNMzPF.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Ghost } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
//#region src/routes/_shell.home.tsx?tsr-split=component
function Home() {
	const { user } = useAuth();
	const { data: posts, isLoading } = useQuery({
		queryKey: ["feed", user?.id],
		queryFn: () => getFeedFn({ data: { userId: user?.id } })
	});
	useFeedRealtime(user?.id);
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "hidden md:block text-2xl font-extrabold mb-4",
				children: "Your feed"
			}),
			isLoading ? /* @__PURE__ */ jsx("div", {
				className: "flex justify-center p-8",
				children: /* @__PURE__ */ jsx("div", { className: "animate-pulse w-8 h-8 rounded-full bg-cyan/20" })
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: posts?.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
					icon: Ghost,
					title: "Nothing to see here",
					description: "Your feed is as quiet as a whisper. Follow some friends or be the first to share your thoughts today."
				}) : posts?.map((p) => {
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
			}),
			/* @__PURE__ */ jsx("div", { className: "h-2" })
		]
	});
}
//#endregion
export { Home as component };
