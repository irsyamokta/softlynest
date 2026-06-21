import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Send, MessageCircle } from "lucide-react";
import { useState, useRef } from "react";
import { getPostFn } from "@/lib/post.server";
import { getCommentsFn } from "@/lib/interaction.server";
import { PostCard } from "@/components/softly/PostCard";
import { EmojiPicker } from "@/components/softly/EmojiPicker";
import { EmptyState } from "@/components/softly/EmptyState";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/post/$id")({
  head: () => ({ meta: [{ title: `Post — Softlynest` }] }),
  component: PostDetail,
});

function PostDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  
  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['post', id, user?.id],
    queryFn: () => getPostFn({ data: { postId: id, userId: user?.id } }),
  });

  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getCommentsFn({ data: id }),
  });

  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const insertEmoji = (emoji: string) => {
    const el = inputRef.current;
    if (!el) { setDraft((v) => v + emoji); return; }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    const newVal = draft.slice(0, start) + emoji + draft.slice(end);
    setDraft(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    // TODO: wire up create comment mutation
    setDraft("");
  };

  const myAvatar = user?.user_metadata?.avatar_url || `https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.user_metadata?.username || "user"}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;

  if (postLoading) {
    return <div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-nest flex items-center justify-center">
        <div className="bg-cream rounded-3xl p-8 text-center">
          <p className="font-bold">Post not found.</p>
          <Link to="/home" className="mt-4 inline-block text-cyan font-bold">Back to home</Link>
        </div>
      </div>
    );
  }

  const mappedPost = {
    id: post.id,
    user: post.user.username,
    avatar: post.user.avatar || "",
    time: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
    text: post.text,
    image: post.image || undefined,
    video: post.video || undefined,
    anonymous: post.anonymous,
    _count: post._count,
    hasLiked: post.hasLiked,
    hasFavorited: post.hasFavorited,
  };

  const commentsList = (
    <ul className="space-y-3">
      {comments.length === 0 ? (
        <EmptyState 
          icon={MessageCircle}
          title="No comments yet"
          description="Be the first to share a kind thought."
        />
      ) : (
        comments.map((c: any) => (
          <li key={c.id} className="flex gap-3">
            <img src={c.user.avatar} alt={c.user.username} className="w-9 h-9 rounded-full object-cover bg-muted shrink-0" />
            <div className="flex-1 bg-muted rounded-2xl px-3 py-2 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-sm truncate text-black">{c.user.username}</span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm leading-snug text-black">{c.text}</p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-pink"><Heart className="w-3.5 h-3.5" /> 0</button>
                <button className="hover:text-foreground font-semibold">Reply</button>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );

  return (
    <>
      {/* Mobile: full screen */}
      <div className="min-h-screen w-full bg-cream flex flex-col md:hidden">
        <header className="flex items-center gap-3 px-5 pt-6 pb-3">
          <Link to="/home" className="p-1" aria-label="Back"><ArrowLeft className="w-6 h-6" strokeWidth={2.5} /></Link>
          <h1 className="text-lg font-extrabold">Comments</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
          <PostCard post={mappedPost} />
          {commentsList}
        </div>

        <form onSubmit={submit} className="bg-nest px-3 py-3 flex items-center gap-2">
          <EmojiPicker onEmojiSelect={insertEmoji} buttonClassName="text-cream/80 hover:text-white transition cursor-pointer p-2" />
          <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a kind comment…" className="flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none text-black" />
          <button type="submit" aria-label="Send" className="w-10 h-10 rounded-full bg-cyan text-primary-foreground flex items-center justify-center shrink-0">
            <Send className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* Desktop: centered modal over a dimmed backdrop */}
      <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center bg-black/50 backdrop-blur-sm p-6">
        <div className="bg-cream rounded-3xl soft-shadow w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center gap-3 px-6 pt-5 pb-3 border-b border-border/40 shrink-0">
            <Link to="/home" className="p-1 hover:text-cyan transition" aria-label="Back">
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </Link>
            <h1 className="text-xl font-extrabold">Comments</h1>
          </header>

          {/* Body: post + comments side by side */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6">
            <div className="sticky top-0 self-start">
              <PostCard post={mappedPost} />
            </div>
            {commentsList}
          </div>

          {/* Comment input */}
          <form onSubmit={submit} className="bg-muted rounded-2xl mx-4 mb-4 px-3 py-3 flex items-center gap-2 shrink-0">
            <EmojiPicker onEmojiSelect={insertEmoji} buttonClassName="text-foreground/60 hover:text-cyan transition cursor-pointer p-2" />
            <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a kind comment…" className="flex-1 bg-cream rounded-full px-4 py-2.5 text-sm outline-none text-black" />
            <button type="submit" aria-label="Send" className="w-10 h-10 rounded-full bg-cyan text-primary-foreground flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
