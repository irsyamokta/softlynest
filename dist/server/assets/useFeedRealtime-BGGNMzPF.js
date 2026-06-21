import { t as supabase } from "./supabase-DsUV4Div.js";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
//#region src/hooks/useFeedRealtime.ts
/**
* useFeedRealtime — single global channel that watches Like, Favorite, Comment, and Post changes.
* When any change happens it invalidates the feed query so all post counts refresh automatically.
*/
function useFeedRealtime(userId) {
	const queryClient = useQueryClient();
	useEffect(() => {
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
