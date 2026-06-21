import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PostCard, PostCardSkeleton } from "@/components/softly/PostCard";
import { getFeedFn } from "@/lib/post.server";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { EmptyState } from "@/components/softly/EmptyState";
import { Ghost } from "lucide-react";
import { useFeedRealtime } from "@/hooks/useFeedRealtime";

export const Route = createFileRoute("/_shell/home")({
  head: () => ({ meta: [{ title: "Home — Softlynest" }] }),
  component: Home,
});

function Home() {
  const { user } = useAuth();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['feed', user?.id],
    queryFn: () => getFeedFn({ data: { userId: user?.id } }),
  });

  // Single global realtime channel — updates all post counts automatically
  useFeedRealtime(user?.id);

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <h2 className="hidden md:block text-2xl font-extrabold mb-4">Your feed</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      ) : (
        <div className="space-y-4">
          {posts?.length === 0 ? (
            <EmptyState 
              icon={Ghost}
              title="Nothing to see here"
              description="Your feed is as quiet as a whisper. Follow some friends or be the first to share your thoughts today."
            />
          ) : (
            posts?.map((p: any) => {
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
            })
          )}
        </div>
      )}
      <div className="h-2" />
    </div>
  );
}
