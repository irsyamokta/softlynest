import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUnreadMessagesCountFn } from "@/lib/message.server";
import { getNotificationsFn } from "@/lib/interaction.server";
import { useAuth } from "@/contexts/AuthContext";

export function useAppBadge() {
  const { user } = useAuth();

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
  });

  const unreadNotificationsCount = notifications.filter((n: any) => !n.read).length || 0;

  useEffect(() => {
    const totalUnread = unreadMessagesCount + unreadNotificationsCount;
    
    if ('setAppBadge' in navigator) {
      if (totalUnread > 0) {
        // @ts-ignore
        navigator.setAppBadge(totalUnread).catch((error) => {
          console.error("Failed to set app badge", error);
        });
      } else {
        // @ts-ignore
        navigator.clearAppBadge().catch((error) => {
          console.error("Failed to clear app badge", error);
        });
      }
    }
  }, [unreadMessagesCount, unreadNotificationsCount]);
}
