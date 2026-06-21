import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-DsUV4Div.mjs";
import { i as useQueryClient, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useFeedRealtime-BGGNMzPF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* useFeedRealtime — single global channel that watches Like, Favorite, Comment, and Post changes.
* When any change happens it invalidates the feed query so all post counts refresh automatically.
*/
function useFeedRealtime(userId) {
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("feed-global").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "Like"
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["feed"] });
			queryClient.invalidateQueries({ queryKey: ["user-posts"] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "Favorite"
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["feed"] });
			queryClient.invalidateQueries({ queryKey: ["user-posts"] });
			if (userId) queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "Comment"
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["feed"] });
			queryClient.invalidateQueries({ queryKey: ["user-posts"] });
		}).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "Post"
		}, () => {
			queryClient.invalidateQueries({ queryKey: ["feed"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [queryClient, userId]);
}
//#endregion
export { useFeedRealtime as t };
