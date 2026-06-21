import { useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { EmptyState } from "@/components/softly/EmptyState";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getNotificationsFn, markNotificationReadFn, markAllNotificationsReadFn, deleteNotificationFn } from "@/lib/interaction.server";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
function SwipeableNotification({ n, onDelete, onRead }: { n: any; onDelete: () => void; onRead: () => void }) {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const currentX = e.clientX;
    const diff = currentX - startX.current;
    if (diff < 0) {
      setOffset(Math.max(diff, -120));
    } else {
      setOffset(0);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    if (offset <= -80) {
      onDelete();
    } else {
      setOffset(0);
    }
    startX.current = null;
    setIsDragging(false);
  };

  const showDeleteZone = offset < -10;

  return (
    <div className="relative overflow-hidden rounded-3xl mb-3 group">
      {showDeleteZone && (
        <div className="absolute inset-0 bg-red-500 flex items-center justify-end px-5 rounded-3xl">
          <Trash2 className="w-5 h-5 text-white" />
        </div>
      )}

      {/* Desktop hover delete button */}
      <button
        onClick={onDelete}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer z-10"
        aria-label="Delete notification"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Foreground Card Layer */}
      <li
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ 
          transform: `translateX(${offset}px)`, 
          transition: isDragging ? 'none' : 'transform 0.25s ease-out',
          cursor: isDragging ? 'grabbing' : 'pointer',
        }}
        className="relative flex items-center gap-3 bg-white p-4 rounded-3xl soft-shadow border border-border/60 select-none hover:brightness-[0.97] transition-all z-10"
      >
        {/* Avatar — clickable to profile */}
        <Link
          to="/user/$username"
          params={{ username: n.user }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink/60 to-yellow/60 shrink-0 overflow-hidden"
          onClick={(e) => { e.stopPropagation(); onRead(); }}
        >
          {n.avatar ? (
            <img src={n.avatar} alt={n.user} className="w-full h-full object-cover" />
          ) : null}
        </Link>

        <div className="flex-1 text-sm leading-snug min-w-0">
          {/* Username — clickable to profile */}
          <Link
            to="/user/$username"
            params={{ username: n.user }}
            className="font-bold text-black hover:underline"
            onClick={(e) => { e.stopPropagation(); onRead(); }}
          >
            {n.user}
          </Link>{" "}
          <span className="text-black">{n.action}</span>
          {n.detail && <span className="text-black"> {n.detail}</span>}
          <div className="text-[11px] text-muted-foreground mt-0.5">{n.time}</div>
        </div>
        {n.unread && <span className="w-2.5 h-2.5 rounded-full bg-cyan shrink-0" />}
      </li>
    </div>
  );
}

export function NotificationsContent() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => getNotificationsFn({ data: user!.id }),
    enabled: !!user?.id,
  });

  // Remove auto-mark-all-read on page open — now done per-click

  // Realtime: refetch when new notification arrives (no filter - check userId in callback)
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel(`notifications-page-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "Notification" }, (payload) => {
        // Only update if this notification is for the current user
        if (payload.new?.userId === user.id) {
          refetch();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, refetch]);

  const handleMarkRead = (id: string) => {
    if (!user?.id) return;
    // Optimistic update in cache
    queryClient.setQueryData(["notifications", user.id], (old: any[]) =>
      old?.map((n) => n.id === id ? { ...n, read: true } : n) ?? []
    );
    markNotificationReadFn({ data: id }).catch(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
    });
  };

  const handleDelete = (id: string) => {
    if (!user?.id) return;
    // Optimistic delete from local cache
    queryClient.setQueryData(["notifications", user?.id], (old: any[]) =>
      old?.filter((n) => n.id !== id) ?? []
    );
    // Persist to DB
    deleteNotificationFn({ data: { notificationId: id, userId: user.id } }).catch(() => {
      // Revert on error
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
    });
  };

  const markAllAsRead = () => {
    if (!user?.id) return;
    markAllNotificationsReadFn({ data: user.id }).then(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
    });
  };

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold">Notifications</h2>
        {notifications.some(n => n.read === false) && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-bold text-cyan hover:opacity-80 transition cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Recent</p>
      
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-3xl soft-shadow border border-border/60 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-nest-foreground/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-nest-foreground/10 rounded" />
                <div className="h-3 w-16 bg-nest-foreground/10 rounded" />
              </div>
            </div>
          ))}
        </div>) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! When someone interacts with you, you'll see it here."
        />
      ) : (
        <ul>
          {notifications.map((n) => {
            // Map Prisma notification to the UI format
            const mappedNotification = {
              id: n.id,
              user: n.actor.username,
              avatar: n.actor.avatar || "",
              action: n.type === "LIKE" ? "liked your post" : n.type === "COMMENT" ? "commented on your post" : "followed you",
              detail: "",
              time: formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }),
              unread: !n.read,
            };
            return <SwipeableNotification key={n.id} n={mappedNotification} onDelete={() => handleDelete(n.id)} onRead={() => handleMarkRead(n.id)} />;
          })}
        </ul>
      )}
      
      <div className="h-2" />
    </div>
  );
}
