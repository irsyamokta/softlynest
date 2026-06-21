import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUnreadMessagesCountFn } from "@/lib/message.server";
import { getNotificationsFn } from "@/lib/interaction.server";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

const NOTIF_PREF_KEY = "softlynest_notif_enabled";
function isNotifEnabled() {
  try { return localStorage.getItem(NOTIF_PREF_KEY) !== "false"; }
  catch { return true; }
}

// ── Badge helper ──────────────────────────────────────────────────────────────
function setBadge(count: number) {
  if (!("setAppBadge" in navigator)) return;
  if (count > 0) {
    (navigator as any).setAppBadge(count).catch(() => {});
  } else {
    (navigator as any).clearAppBadge().catch(() => {});
  }
}

// Request notification permission (needed for badge API on some platforms)
async function requestNotificationPermission() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

export function useAppBadge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Request permission on mount (needed for badge on Android/iOS PWA)
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ["unread-messages", user?.id],
    queryFn: () => getUnreadMessagesCountFn({ data: user!.id }),
    enabled: !!user?.id,
    refetchInterval: 5000,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => getNotificationsFn({ data: user!.id }),
    enabled: !!user?.id,
    refetchInterval: 10000,
  });

  const unreadNotificationsCount =
    (notifications as any[]).filter((n) => !n.read).length;

  // Update badge whenever counts change
  useEffect(() => {
    if (!isNotifEnabled()) {
      setBadge(0);
      return;
    }
    setBadge(unreadMessagesCount + unreadNotificationsCount);
  }, [unreadMessagesCount, unreadNotificationsCount]);

  // Realtime: update badge immediately on new message or notification
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`badge-realtime-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `receiverId=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["unread-messages", user.id] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Notification",
          filter: `userId=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Clear badge when app comes back to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Refetch to get latest counts when user returns to app
        queryClient.invalidateQueries({ queryKey: ["unread-messages", user?.id] });
        queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user?.id, queryClient]);
}
