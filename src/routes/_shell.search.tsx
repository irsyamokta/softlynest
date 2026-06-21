import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { getHashtagsFn, searchPostsFn, getExploreFeedFn } from "@/lib/post.server";
import { searchUsersFn } from "@/lib/auth.server";
import { PostCard, PostCardSkeleton } from "@/components/softly/PostCard";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { EmptyState } from "@/components/softly/EmptyState";
import { SearchX, Hash, Compass, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useFeedRealtime } from "@/hooks/useFeedRealtime";

export const Route = createFileRoute("/_shell/search")({
  head: () => ({ meta: [{ title: "Search — Softlynest" }] }),
  loader: () => getHashtagsFn(),
  validateSearch: (search: Record<string, unknown>) => ({
    q: (search.q as string) || "",
  }),
  component: SearchPage,
});


function SearchPage() {
  const hashtags = Route.useLoaderData();
  const { q: initialQ } = Route.useSearch();
  const [query, setQuery] = useState(initialQ || "");
  const [tab, setTab] = useState<"posts" | "users">("posts");
  const [results, setResults] = useState<any[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch explore feed (randomized posts) when no query is present
  const { data: explorePosts, isLoading: isLoadingExplore } = useQuery({
    queryKey: ['explore-feed', user?.id],
    queryFn: () => getExploreFeedFn({ data: { userId: user?.id } }),
    enabled: !query,
  });

  // Enable realtime for search/explore posts
  useFeedRealtime(user?.id);

  // Sync if URL param changes (e.g. clicking different hashtag links)
  useEffect(() => { setQuery(initialQ || ""); }, [initialQ]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setUserResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      if (tab === "posts") {
        const posts = await searchPostsFn({ data: { query, userId: user?.id } });
        setResults(posts);
      } else {
        const users = await searchUsersFn({ data: { query, currentUserId: user?.id } });
        setUserResults(users);
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query, tab, user?.id]);

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <h2 className="hidden md:block text-2xl font-extrabold mb-4">What is on your mind today?</h2>
      <h2 className="md:hidden text-xl font-extrabold mb-3">What is on your mind today?</h2>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts, users, hashtags…"
          className="w-full bg-muted rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {query && (
        <div className="flex gap-2 mt-4 bg-nest-foreground/5 p-1 rounded-full w-fit">
          <button
            onClick={() => setTab("posts")}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${
              tab === "posts" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setTab("users")}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${
              tab === "users" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"
            }`}
          >
            Users
          </button>
        </div>
      )}

      {!query && (
        <>
          <div className="flex flex-wrap gap-2 mt-4">
            {hashtags.slice(0, 10).map((h) => (
              <button
                key={h.id}
                onClick={() => setQuery(h.name)}
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-cyan/20 text-foreground hover:bg-cyan/40 transition cursor-pointer"
              >
                #{h.name}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <Compass className="w-5 h-5" />
              <h3 className="font-bold text-sm">Explore</h3>
            </div>
            {isLoadingExplore ? (
              <div className="md:columns-2 md:gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="break-inside-avoid mb-4">
                    <PostCardSkeleton />
                  </div>
                ))}
              </div>
            ) : explorePosts && explorePosts.length > 0 ? (
              <div className="md:columns-2 md:gap-4">
                {explorePosts.map((p: any) => {
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
                      <PostCard post={mappedPost as any} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Hash}
                title="Explore Softlynest"
                description="Discover new people, thoughts, and conversations. Try searching for a topic or click a hashtag above."
              />
            )}
          </div>
        </>
      )}

      {query && tab === "posts" && (
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="space-y-4">
              <PostCardSkeleton />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </div>
          ) : results.length > 0 ? (
            results.map((p) => {
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
          ) : (
            <EmptyState
              icon={SearchX}
              title="No posts found"
              description={`We couldn't find any posts matching "${query}".`}
            />
          )}
        </div>
      )}

      {query && tab === "users" && (
        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 py-3 px-4 bg-white rounded-2xl border border-border/60 animate-pulse">
                  <div className="w-11 h-11 rounded-full bg-nest-foreground/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-nest-foreground/10 rounded" />
                    <div className="h-3 w-16 bg-nest-foreground/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : userResults.length > 0 ? (
            userResults.map((u) => {
              const avatarUrl = u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;
              return (
                <Link
                  key={u.id}
                  to="/user/$username"
                  params={{ username: u.username }}
                  className="flex items-center gap-3 py-3 px-4 bg-white rounded-2xl border border-border/60 hover:bg-black/5 transition"
                >
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60">
                    <img src={avatarUrl} alt={u.username} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-black truncate">{u.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                  </div>
                </Link>
              );
            })
          ) : (
            <EmptyState
              icon={Users}
              title="No users found"
              description={`We couldn't find anyone with the name "${query}".`}
            />
          )}
        </div>
      )}
      <div className="h-4" />
    </div>
  );
}
