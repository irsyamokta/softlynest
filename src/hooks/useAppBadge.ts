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

// ── Badge via Service Worker (works on Android Chrome PWA) ───────────────────
function setBadge(count: number) {
  // 1. Try direct navigator API (desktop Chrome, some Android)
  if ("setAppBadge" in navigator) {
    if (count > 0) {
      (navigator as any).setAppBadge(count).catch(() => {});
    } else {
      (navigator as any).clearAppBadge().catch(() => {});
    }
  }

  // 2. Also send to service worker (more reliable on Android PWA)
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SET_BADGE",
      count,
    });
  }
}

// ── Show OS notification via SW (works when app is in background) ─────────────
export function showPushNotification(title: string, body: string) {
  if (!isNotifEnabled()) return;
  if (Notification.permission !== "granted") return;

  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SHOW_NOTIFICATION",
      title,
      body,
      icon: "/icons/icon-192x192.png",
    });
  } else if ("Notification" in window && Notification.permission === "granted") {
    // Fallback: direct notification (works when app is open)
    new Notification(title, { body, icon: "/icons/icon-192x192.png" });
  }
}

export function useAppBadge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "Message",
        filter: `receiverId=eq.${user.id}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["unread-messages", user.id] });
      })
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "Notification",
        filter: `userId=eq.${user.id}`,
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        // Show OS notification when app is in background
        if (document.visibilityState === "hidden") {
          showPushNotification("Softlynest", "You have a new notification 🔔");
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id, queryClient]);

  // Refresh counts when app comes back to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        queryClient.invalidateQueries({ queryKey: ["unread-messages", user?.id] });
        queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user?.id, queryClient]);
}
