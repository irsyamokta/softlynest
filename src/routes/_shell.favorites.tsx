import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PostCard, PostCardSkeleton } from "@/components/softly/PostCard";
import { EmptyState } from "@/components/softly/EmptyState";
import { getFavoritesFn } from "@/lib/post.server";
import { useAuth } from "@/contexts/AuthContext";
import { Star, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useFeedRealtime } from "@/hooks/useFeedRealtime";

export const Route = createFileRoute("/_shell/favorites")({
  head: () => ({ meta: [{ title: "Favorites — Softlynest" }] }),
  component: Favorites,
});

function Favorites() {
  const { user } = useAuth();
  const { data: favorites, isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: () => getFavoritesFn({ data: user!.id }),
    enabled: !!user?.id,
  });

  useFeedRealtime(user?.id);

  return (
    <div className="px-4 py-4 md:px-0 md:py-0 space-y-4">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold">Your favorites</h2>
        <p className="text-xs text-muted-foreground mt-1">Posts you've starred to revisit.</p>
      </div>
      
      {isLoading ? (
        <div className="columns-1 md:columns-2 gap-4">
          <div className="break-inside-avoid mb-4"><PostCardSkeleton /></div>
          <div className="break-inside-avoid mb-4"><PostCardSkeleton /></div>
          <div className="break-inside-avoid mb-4"><PostCardSkeleton /></div>
        </div>
      ) : favorites?.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No favorites yet"
          description="You haven't favorited any posts. Click the star icon on a post you like to save it here."
        />
      ) : (
        <div className="columns-1 md:columns-2 gap-4">
          {favorites?.map((p: any) => {
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
            return (
              <div key={p.id} className="break-inside-avoid mb-4">
                {/* @ts-ignore */}
                <PostCard post={mappedPost} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
