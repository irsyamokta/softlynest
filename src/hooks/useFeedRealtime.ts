import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * useFeedRealtime — single global channel that watches Like, Favorite, Comment, and Post changes.
 * When any change happens it invalidates the feed query so all post counts refresh automatically.
 */
export function useFeedRealtime(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase.channel("feed-global")
      .on("postgres_changes", { event: "*", schema: "public", table: "Like" }, () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "Favorite" }, () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["user-posts"] });
        if (userId) queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "Comment" }, () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "Post" }, () => {
        queryClient.invalidateQueries({ queryKey: ["feed"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);
}
