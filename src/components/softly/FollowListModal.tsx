import { useState, useEffect } from "react";
import { X, UserCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { getFollowListFn } from "@/lib/auth.server";
import { toggleFollowFn } from "@/lib/interaction.server";
import { toast } from "sonner";

interface FollowUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  isFollowing: boolean;
}

interface FollowListModalProps {
  profileUserId: string;
  type: "followers" | "following";
  count: number;
  onClose: () => void;
}

function UserRow({
  u,
  currentUserId,
  onClose,
}: {
  u: FollowUser;
  currentUserId: string;
  onClose: () => void;
}) {
  const [following, setFollowing] = useState(u.isFollowing);
  const isMe = u.id === currentUserId;

  const avatarUrl =
    u.avatar ||
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;

  const handleToggle = async () => {
    if (isMe) return;
    const next = !following;
    setFollowing(next);
    try {
      await toggleFollowFn({
        data: {
          followerId: currentUserId,
          followingId: u.id,
          action: next ? "follow" : "unfollow",
        },
      });
    } catch {
      toast.error("Failed to update follow");
      setFollowing(!next);
    }
  };

  return (
    <div className="flex items-center gap-3 py-3 px-1 border-b border-border/30 last:border-0">
      {/* Avatar → profile */}
      <Link
        to="/user/$username"
        params={{ username: u.username }}
        onClick={onClose}
        className="shrink-0"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-pink/60 to-yellow/60">
          <img src={avatarUrl} alt={u.username} className="w-full h-full object-cover" />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to="/user/$username"
          params={{ username: u.username }}
          onClick={onClose}
          className="font-bold text-sm text-black hover:underline truncate block"
        >
          @{u.username}
        </Link>
        {u.bio && (
          <p className="text-xs text-muted-foreground truncate">{u.bio}</p>
        )}
      </div>

      {/* Follow button (hide for self) */}
      {!isMe && (
        <button
          onClick={handleToggle}
          className={`shrink-0 flex items-center gap-1.5 rounded-full font-bold text-xs px-4 py-2 transition cursor-pointer ${
            following
              ? "bg-nest-foreground/10 text-nest-foreground hover:bg-nest-foreground/20"
              : "bg-cyan text-white hover:bg-cyan/90"
          }`}
        >
          {following && <UserCheck className="w-3.5 h-3.5" />}
          {following ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}

export function FollowListModal({
  profileUserId,
  type,
  count,
  onClose,
}: FollowListModalProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"followers" | "following">(type);

  useEffect(() => {
    setLoading(true);
    getFollowListFn({
      data: { profileUserId, type: tab, currentUserId: user?.id },
    })
      .then((list) => {
        setUsers(list as FollowUser[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [tab, profileUserId, user?.id]);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative w-full max-w-md bg-cream rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/30">
          <div className="flex gap-1 bg-nest-foreground/10 p-1 rounded-full">
            <button
              onClick={() => setTab("followers")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${
                tab === "followers"
                  ? "bg-white text-black shadow-sm"
                  : "text-muted-foreground hover:text-black"
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setTab("following")}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${
                tab === "following"
                  ? "bg-white text-black shadow-sm"
                  : "text-muted-foreground hover:text-black"
              }`}
            >
              Following
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[60vh] px-5 py-2">
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">Loading...</div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm font-bold text-black mb-1">
                {tab === "followers" ? "No followers yet" : "Not following anyone"}
              </p>
              <p className="text-xs text-muted-foreground">
                {tab === "followers"
                  ? "When someone follows this account, they'll show up here."
                  : "When this account follows someone, they'll show up here."}
              </p>
            </div>
          ) : (
            users.map((u) => (
              <UserRow
                key={u.id}
                u={u}
                currentUserId={user?.id ?? ""}
                onClose={onClose}
              />
            ))
          )}
        </div>

        {/* Bottom safe area */}
        <div className="h-4" />
      </div>
    </div>
  );
}
