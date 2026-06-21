import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, MessageSquare, Star, Play, MoreHorizontal, Trash2 } from "lucide-react";
import { UserCircle2 } from "lucide-react";
import { CommentModal } from "./CommentModal";
import { ConfirmModal } from "./ConfirmModal";
import { supabase } from "@/lib/supabase";
import { likePostFn, favoritePostFn } from "@/lib/interaction.server";
import { deletePostFn } from "@/lib/post.server";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const formatCount = (count: number) => count > 99 ? "99+" : count;

// Render post text with clickable hashtags
function PostText({ text }: { text: string }) {
  const parts = text.split(/(#[\w\u00C0-\u017F]+)/g);
  return (
    <p className="text-sm leading-relaxed whitespace-pre-line text-black">
      {parts.map((part, i) =>
        /^#[\w\u00C0-\u017F]+$/.test(part) ? (
          <Link
            key={i}
            to="/search"
            search={{ q: part.slice(1) } as any}
            className="text-cyan font-semibold hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

// Extended Post type for the mapped data from Prisma
export type MappedPost = {
  id: string;
  user: string;
  avatar: string;
  time: string;
  text: string;
  image?: string;
  video?: string;
  anonymous?: boolean;
  _count?: { likes: number; comments: number; favorites: number };
  hasLiked?: boolean;
  hasFavorited?: boolean;
};

export function PostCard({ post }: { post: MappedPost }) {
  const { user } = useAuth();
  const currentUsername = user?.user_metadata?.username;
  const isOwnPost = currentUsername && post.user === currentUsername;
  const profileLink = isOwnPost ? "/profile" : "/user/$username";
  const profileParams = isOwnPost ? {} : { username: post.user };

  const [liked, setLiked] = useState(post.hasLiked ?? false);
  const [fav, setFav] = useState(post.hasFavorited ?? false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    setLiked(post.hasLiked ?? false);
    setFav(post.hasFavorited ?? false);
  }, [post.hasLiked, post.hasFavorited]);

  // Use real counts if available, fallback to deterministic mock for prototype safety
  const initialLikes = post._count?.likes ?? useMemo(() => (post.text.length * 3) % 150, [post.text]);
  const initialFavs = post._count?.favorites ?? useMemo(() => (post.text.length * 2) % 120, [post.text]);
  const commentCountState = post._count?.comments ?? 0;

  const [likeCount, setLikeCount] = useState(initialLikes);
  const [favCount, setFavCount] = useState(initialFavs);
  const [commentCount, setCommentCount] = useState(commentCountState);

  // Keep counts in sync when parent re-renders with fresh data
  useEffect(() => {
    setLikeCount(post._count?.likes ?? initialLikes);
    setFavCount(post._count?.favorites ?? initialFavs);
    setCommentCount(post._count?.comments ?? 0);
  }, [post._count?.likes, post._count?.favorites, post._count?.comments]);

  const handleLike = async () => {
    // Optimistic UI
    const isLiking = !liked;
    setLiked(isLiking);
    setLikeCount((c) => (isLiking ? c + 1 : c - 1));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      await likePostFn({ data: { postId: post.id, userId: user.id, action: isLiking ? "like" : "unlike" } });
    } catch (err: any) {
      toast.error(err.message || "Failed to like");
      // Revert optimistic UI
      setLiked(!isLiking);
      setLikeCount((c) => (isLiking ? c - 1 : c + 1));
    }
  };

  const handleFav = async () => {
    // Optimistic UI
    const isFaving = !fav;
    setFav(isFaving);
    setFavCount((c) => (isFaving ? c + 1 : c - 1));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      await favoritePostFn({ data: { postId: post.id, userId: user.id, action: isFaving ? "favorite" : "unfavorite" } });
    } catch (err: any) {
      toast.error(err.message || "Failed to favorite");
      // Revert optimistic UI
      setFav(!isFaving);
      setFavCount((c) => (isFaving ? c - 1 : c + 1));
    }
  };

  if (isDeleted) return null;

  return (
    <article className="bg-white rounded-3xl p-4 soft-shadow border border-border/60">
      <header className="flex items-center gap-3 mb-2 relative">
        {post.anonymous ? (
          <div className="w-10 h-10 rounded-full bg-pink flex items-center justify-center shrink-0">
            <UserCircle2 className="w-7 h-7 text-white" />
          </div>
        ) : (
          <Link to={profileLink} params={profileParams} className="shrink-0">
            <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover bg-muted hover:opacity-80 transition" />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            {post.anonymous ? (
              <span className="font-bold text-sm text-black">Anonymous</span>
            ) : (
              <Link to={profileLink} params={profileParams} className="font-bold text-sm text-black hover:underline">
                {post.user}
              </Link>
            )}
            <span className="text-xs text-muted-foreground">{post.time}</span>
          </div>
        </div>
        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-full hover:bg-muted transition text-muted-foreground cursor-pointer"
              aria-label="Post options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-border/40 p-1 z-50">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setConfirmDeleteOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>
      <PostText text={post.text} />
      
      {post.video ? (
        <div className="relative mt-3 rounded-2xl overflow-hidden bg-black">
          <video
            src={post.video}
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full max-h-[400px] object-contain"
          />
        </div>
      ) : post.image ? (
        <div className="relative mt-3 rounded-2xl overflow-hidden">
          <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" />
        </div>
      ) : null}
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={handleLike}
          aria-label="Like"
          className={`relative w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${liked ? "bg-pink text-cream" : "bg-pink/15 text-pink"}`}
        >
          <Heart className="w-4.5 h-4.5" fill={liked ? "currentColor" : "none"} strokeWidth={2.5} />
          {likeCount > 0 && (
            <span className="absolute -top-1.5 -right-1 flex min-w-[16px] h-4 px-1 items-center justify-center rounded-full bg-pink text-[9px] font-bold text-white ring-2 ring-white">
              {formatCount(likeCount)}
            </span>
          )}
        </button>
        <button
          onClick={() => setCommentOpen(true)}
          aria-label="Comment"
          className="relative w-9 h-9 rounded-full bg-cyan text-primary-foreground flex items-center justify-center cursor-pointer"
        >
          <MessageSquare className="w-4.5 h-4.5" strokeWidth={2.5} />
          {commentCount > 0 && (
            <span className="absolute -top-1.5 -right-1 flex min-w-[16px] h-4 px-1 items-center justify-center rounded-full bg-cyan text-[9px] font-bold text-white ring-2 ring-white">
              {formatCount(commentCount)}
            </span>
          )}
        </button>
        <button
          onClick={handleFav}
          aria-label="Favorite"
          className={`relative w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${fav ? "bg-yellow text-accent-foreground" : "bg-yellow/30 text-yellow"}`}
        >
          <Star className="w-4.5 h-4.5" fill={fav ? "currentColor" : "none"} strokeWidth={2.5} />
          {favCount > 0 && (
            <span className="absolute -top-1.5 -right-1 flex min-w-[16px] h-4 px-1 items-center justify-center rounded-full bg-yellow text-[9px] font-bold text-white ring-2 ring-white">
              {formatCount(favCount)}
            </span>
          )}
        </button>
      </div>
      {commentOpen && <CommentModal post={post} onClose={() => setCommentOpen(false)} />}
      {confirmDeleteOpen && (
        <ConfirmModal
          title="Delete post?"
          description="This action cannot be undone. Your post and all its comments will be removed."
          confirmText="Delete"
          variant="danger"
          onClose={() => setConfirmDeleteOpen(false)}
          onConfirm={async () => {
            try {
              setIsDeleted(true);
              await deletePostFn({ data: { postId: post.id, userId: user!.id } });
              toast.success("Post deleted");
            } catch (err: any) {
              setIsDeleted(false);
              toast.error(err.message || "Failed to delete post");
            }
          }}
        />
      )}
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-4 soft-shadow border border-border/60 animate-pulse">
      {/* Header */}
      <header className="flex items-center gap-3 mb-2 relative">
        <div className="w-10 h-10 rounded-full bg-nest-foreground/10 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <div className="h-4 w-24 bg-nest-foreground/10 rounded" />
            <div className="h-3 w-12 bg-nest-foreground/10 rounded" />
          </div>
        </div>
      </header>
      
      {/* Text content */}
      <div className="space-y-2 py-1">
        <div className="h-4 w-full bg-nest-foreground/10 rounded" />
        <div className="h-4 w-[90%] bg-nest-foreground/10 rounded" />
        <div className="h-4 w-[60%] bg-nest-foreground/10 rounded" />
      </div>

      {/* Footer / actions */}
      <div className="flex justify-end gap-2 mt-3">
        <div className="w-9 h-9 rounded-full bg-nest-foreground/10" />
        <div className="w-9 h-9 rounded-full bg-nest-foreground/10" />
        <div className="w-9 h-9 rounded-full bg-nest-foreground/10" />
      </div>
    </div>
  );
}
