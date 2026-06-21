import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, Ghost } from "lucide-react";
import { PostCard, PostCardSkeleton } from "./PostCard";
import { EmptyState } from "@/components/softly/EmptyState";
import { getMyProfileFn, getProfileByUsernameFn } from "@/lib/auth.server";
import { getUserPostsFn } from "@/lib/post.server";
import { toggleFollowFn } from "@/lib/interaction.server";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import { FollowListModal } from "./FollowListModal";

interface ProfileContentProps {
  username?: string; // if undefined, shows own profile
}

export function ProfileContent({ username }: ProfileContentProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentUsername = user?.user_metadata?.username;
  
  // If viewing another profile but the username matches current user, redirect to own profile layout.
  // Although the user asked for redirection on click, if they manually visit /user/username,
  // we can also handle it gracefully here by treating isOwnProfile as true.
  const isOwnProfile = !username || username === currentUsername;
  const targetUsername = isOwnProfile ? currentUsername : username;

  const [following, setFollowing] = useState(false);
  const [followModal, setFollowModal] = useState<"followers" | "following" | null>(null);

  // Fetch profile data from Prisma DB
  const { data: dbProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", isOwnProfile ? "me" : username, user?.id],
    queryFn: async () => {
      if (isOwnProfile && user?.id) {
        return getMyProfileFn({ data: user.id });
      } else if (username) {
        return getProfileByUsernameFn({ data: { username, currentUserId: user?.id } });
      }
      return null;
    },
    enabled: isOwnProfile ? !!user?.id : !!username,
  });

  // Fetch user posts
  const { data: userPosts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ["user-posts", isOwnProfile ? user?.id : username, user?.id],
    queryFn: async () => {
      return getUserPostsFn({
        data: {
          targetUserId: isOwnProfile ? user?.id : undefined,
          targetUsername: isOwnProfile ? undefined : username,
          currentUserId: user?.id,
        }
      });
    },
    enabled: isOwnProfile ? !!user?.id : !!username,
  });

  // Build the avatar URL — use DB avatar first, then DiceBear based on username
  const displayUsername = dbProfile?.username || targetUsername || "user";
  const avatarUrl = dbProfile?.avatar ||
    (isOwnProfile ? user?.user_metadata?.avatar_url : null) ||
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${displayUsername}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;

  const avatarEl = (
    <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-cream soft-shadow shrink-0 ${!dbProfile?.avatar ? 'bg-gradient-to-br from-pink to-yellow' : ''}`}>
      <img src={avatarUrl} alt={displayUsername} className="w-full h-full object-cover" />
    </div>
  );

  const displayName = `@${displayUsername}`;
  const bio = dbProfile?.bio || (isOwnProfile ? user?.user_metadata?.bio : "") || "";

  const postCount = dbProfile?._count?.posts ?? userPosts.length;
  const initialFollowerCount = dbProfile?._count?.followers ?? 0;
  const initialFollowingCount = dbProfile?._count?.following ?? 0;

  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount);
  const [isFollowingMe, setIsFollowingMe] = useState(false);

  useEffect(() => {
    if (dbProfile) {
      setFollowerCount(dbProfile._count?.followers ?? 0);
      setFollowingCount(dbProfile._count?.following ?? 0);
      // @ts-ignore
      if (dbProfile.isFollowing !== undefined) setFollowing(dbProfile.isFollowing);
      // @ts-ignore
      if (dbProfile.isFollowingMe !== undefined) setIsFollowingMe(dbProfile.isFollowingMe);
    }
  }, [dbProfile]);

  useEffect(() => {
    if (!dbProfile?.id) return;
    const channel = supabase.channel(`follows-${dbProfile.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "Follow", filter: `"followingId"=eq.${dbProfile.id}` }, () => {
        setFollowerCount((c) => c + 1);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "Follow", filter: `"followingId"=eq.${dbProfile.id}` }, () => {
        setFollowerCount((c) => Math.max(0, c - 1));
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "Follow", filter: `"followerId"=eq.${dbProfile.id}` }, () => {
        setFollowingCount((c) => c + 1);
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "Follow", filter: `"followerId"=eq.${dbProfile.id}` }, () => {
        setFollowingCount((c) => Math.max(0, c - 1));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dbProfile?.id]);

  const handleFollow = async () => {
    if (!user) {
      toast.error("Please login to follow");
      return;
    }
    if (!dbProfile?.id) return;

    const isFollowing = !following;
    setFollowing(isFollowing);
    setFollowerCount((c) => (isFollowing ? c + 1 : Math.max(0, c - 1)));

    try {
      await toggleFollowFn({
        data: { followerId: user.id, followingId: dbProfile.id, action: isFollowing ? "follow" : "unfollow" },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to follow");
      setFollowing(!isFollowing);
      setFollowerCount((c) => (isFollowing ? c - 1 : c + 1));
    }
  };

  if (isProfileLoading || isPostsLoading) {
    return (
      <div className="px-4 py-4 md:px-0 md:py-0 animate-pulse">
        <h2 className="hidden md:block text-2xl font-extrabold mb-4">Profile</h2>

        {/* Profile Info Header Skeleton */}
        <div className="pb-4 flex items-center gap-4">
          <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-nest-foreground/10 shrink-0" />
          <div className="flex-1 space-y-3 min-w-0">
            <div className="h-6 w-32 bg-nest-foreground/10 rounded" />
            <div className="h-4 w-48 bg-nest-foreground/10 rounded" />
            <div className="flex gap-4 mt-2">
              <div className="h-4 w-12 bg-nest-foreground/10 rounded" />
              <div className="h-4 w-16 bg-nest-foreground/10 rounded" />
              <div className="h-4 w-16 bg-nest-foreground/10 rounded" />
            </div>
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="mb-6 flex gap-3">
          <div className="h-10 w-28 bg-nest-foreground/10 rounded-full" />
        </div>

        {/* Posts List Skeleton */}
        <div className="pb-8">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 border-b border-border/40 pb-2">Posts</p>
          <div className="space-y-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <h2 className="hidden md:block text-2xl font-extrabold mb-4">Profile</h2>

      <div className="pb-4 flex items-center gap-4">
        {avatarEl}
        <div className="min-w-0">
          <p className="font-extrabold text-lg md:text-2xl truncate text-black">{displayName}</p>
          {bio && <p className="text-xs md:text-sm text-gray-800 mt-0.5">{bio}</p>}
          <div className="flex gap-4 mt-2 text-xs md:text-sm text-black">
            <span><b>{postCount}</b> <span className="text-muted-foreground">posts</span></span>
            <button
              onClick={() => setFollowModal("followers")}
              className="cursor-pointer hover:underline text-left"
            >
              <b>{followerCount}</b> <span className="text-muted-foreground">followers</span>
            </button>
            <button
              onClick={() => setFollowModal("following")}
              className="cursor-pointer hover:underline text-left"
            >
              <b>{followingCount}</b> <span className="text-muted-foreground">following</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        {isOwnProfile ? (
          <Link
            to="/settings"
            className="flex-1 md:flex-none md:w-auto md:px-8 rounded-full bg-nest-foreground/10 text-nest-foreground font-bold py-2.5 text-sm hover:bg-nest-foreground/20 transition cursor-pointer text-center block"
          >
            Edit profile
          </Link>
        ) : (
          <>
            <button
              onClick={handleFollow}
              className={`flex-1 md:flex-none md:px-8 flex items-center justify-center gap-2 rounded-full font-bold py-2.5 text-sm transition cursor-pointer ${
                following
                  ? "bg-nest-foreground/10 text-nest-foreground hover:bg-nest-foreground/20"
                  : isFollowingMe
                  ? "bg-pink text-white hover:bg-pink/90"
                  : "bg-cyan text-primary-foreground hover:bg-cyan/90"
              }`}
            >
              {following && <UserCheck className="w-4 h-4" />}
              {following ? "Following" : isFollowingMe ? "Follow Back" : "Follow"}
            </button>
            <Link
              to="/messages/$messageId"
              params={{ messageId: dbProfile?.username || "" }}
              className="flex-1 md:flex-none md:px-8 rounded-full bg-nest-foreground/10 text-nest-foreground font-bold py-2.5 text-sm hover:bg-nest-foreground/20 transition cursor-pointer text-center block"
            >
              Message
            </Link>
          </>
        )}
      </div>

      <div className="pb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 border-b border-border/40 pb-2">Posts</p>
        {userPosts.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Ghost}
              title="No posts yet"
              description="This space is empty. When posts are created, they'll show up here."
            />
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map((p: any) => {
              const mappedPost = {
                id: p.id,
                user: p.user.username,
                avatar: p.user.avatar || "",
                time: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
                text: p.text,
                image: p.image || undefined,
                video: p.video || undefined,
                anonymous: p.anonymous,
                _count: p._count,
                hasLiked: p.hasLiked,
                hasFavorited: p.hasFavorited,
              };
              // @ts-ignore
              return <PostCard key={p.id} post={mappedPost} />;
            })}
          </div>
        )}
      </div>

      {/* Followers / Following modal */}
      {followModal && dbProfile?.id && (
        <FollowListModal
          profileUserId={dbProfile.id}
          type={followModal}
          count={followModal === "followers" ? followerCount : followingCount}
          onClose={() => setFollowModal(null)}
        />
      )}
    </div>
  );
}
