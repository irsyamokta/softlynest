import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";
import { EmojiPicker } from "./EmojiPicker";
import { ConfirmModal } from "./ConfirmModal";
import { getCommentsFn, commentPostFn, deleteCommentFn } from "@/lib/interaction.server";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface CommentModalProps {
  post: any;
  onClose: () => void;
}

export function CommentModal({ post, onClose }: CommentModalProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [draft, setDraft] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    getCommentsFn({ data: post.id }).then(fetched => {
      setComments(fetched);
      setLoading(false);
    });

    const channel = supabase.channel(`comments-${post.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "Comment" }, (payload) => {
        if (payload.new?.postId === post.id) {
          // Fetch real data to replace any optimistic entries and catch comments from other users
          getCommentsFn({ data: post.id }).then(setComments);
        }
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "Comment" }, (payload) => {
        if (payload.old?.postId === post.id) {
          setComments((prev) => prev.filter((c: any) => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [post.id]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }, [draft]);

  // Scroll to bottom when new comment appears
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) { setDraft((v) => v + emoji); return; }
    const start = el.selectionStart ?? draft.length;
    const end = el.selectionEnd ?? draft.length;
    setDraft(draft.slice(0, start) + emoji + draft.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!draft.trim()) return;

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { toast.error("Please login to comment"); return; }

      const text = draft.trim();
      setDraft("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      // Optimistic update — show comment immediately like chat
      const optimisticComment = {
        id: `optimistic-${Date.now()}`,
        text,
        createdAt: new Date().toISOString(),
        user: {
          username: authUser.user_metadata?.username || authUser.email,
          avatar: authUser.user_metadata?.avatar_url || null,
        },
        _optimistic: true,
      };
      setComments((prev) => [...prev, optimisticComment]);

      // Persist to server
      await commentPostFn({ data: { postId: post.id, userId: authUser.id, text } });

      // Replace optimistic entry with real data from server
      getCommentsFn({ data: post.id }).then(setComments);
    } catch (err: any) {
      // Rollback optimistic update on error
      setComments((prev) => prev.filter((c) => !c._optimistic));
      toast.error(err.message || "Failed to comment");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      style={{ animation: isClosing ? "fadeOut 0.2s forwards" : "fadeIn 0.2s ease-out" }}
    >
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Mobile: sheet from bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 md:hidden bg-cream rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-10"
        style={{ animation: isClosing ? "slideDownSheet 0.2s forwards" : "slideUpSheet 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/40 shrink-0">
          <h2 className="text-base font-extrabold">Comments</h2>
          <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-muted transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 chat-scroll">
          {/* Post preview */}
          <div className="bg-white rounded-2xl p-3 border border-border/60 soft-shadow">
            <div className="flex items-center gap-2 mb-1.5">
              <img src={post.avatar} alt={post.user} className="w-8 h-8 rounded-full object-cover bg-muted shrink-0" />
              <div>
                <p className="font-bold text-xs text-black">{post.anonymous ? "Anonymous" : post.user}</p>
                <p className="text-[10px] text-muted-foreground">{post.time}</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-black whitespace-pre-line line-clamp-3">{post.text}</p>
          </div>
          <div className="mt-4 mb-2 px-1">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Comments</p>
          </div>
          <CommentList comments={comments} loading={loading} currentUser={user} />
          <div ref={bottomRef} />
        </div>
        <form onSubmit={submit} className="bg-nest px-3 py-3 flex items-end gap-2 shrink-0">
          <EmojiPicker onEmojiSelect={insertEmoji} buttonClassName="text-cream/80 hover:text-white transition cursor-pointer p-2" />
          <div className="flex-1 bg-cream rounded-3xl px-4 py-2.5 flex items-end min-h-[44px]">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a kind comment…"
              rows={1}
              style={{ height: "auto", maxHeight: "120px" }}
              className="w-full bg-transparent text-sm outline-none resize-none leading-snug text-black placeholder:text-muted-foreground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            />
          </div>
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label="Send"
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${
              draft.trim() ? "bg-cyan text-white hover:bg-cyan/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* Desktop: centered modal */}
      <div
        className="absolute hidden md:flex inset-0 items-center justify-center p-8 z-10"
        onClick={handleClose}
      >
        <div
          className="relative flex flex-col bg-cream rounded-3xl shadow-2xl w-full max-w-3xl max-h-full overflow-hidden"
          style={{ animation: isClosing ? "popOut 0.2s forwards" : "popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/40 shrink-0">
            <h1 className="text-xl font-extrabold">Comments</h1>
            <button onClick={handleClose} className="p-1.5 rounded-full hover:bg-muted transition cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 chat-scroll">
            <div className="sticky top-0 self-start bg-white rounded-3xl p-4 soft-shadow border border-border/60">
              <div className="flex items-center gap-3 mb-2">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover bg-muted shrink-0" />
                <div>
                  <p className="font-bold text-sm text-black">{post.anonymous ? "Anonymous" : post.user}</p>
                  <p className="text-xs text-muted-foreground">{post.time}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-line text-black">{post.text}</p>
              {post.image && (
                <div className="mt-3 rounded-2xl overflow-hidden">
                  <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" />
                </div>
              )}
            </div>
            <ul className="space-y-3">
              <CommentList comments={comments} loading={loading} currentUser={user} />
              <div ref={bottomRef} />
            </ul>
          </div>
          <form onSubmit={submit} className="bg-muted rounded-2xl mx-4 mb-4 px-3 py-3 flex items-end gap-2 shrink-0">
            <EmojiPicker onEmojiSelect={insertEmoji} buttonClassName="text-foreground/60 hover:text-cyan transition cursor-pointer p-2" />
            <div className="flex-1 bg-white rounded-3xl px-4 py-2.5 flex items-end min-h-[44px]">
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a kind comment…"
                rows={1}
                style={{ height: "auto", maxHeight: "120px" }}
                className="w-full bg-transparent text-sm outline-none resize-none leading-snug text-black placeholder:text-muted-foreground [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              />
            </div>
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Send"
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition cursor-pointer ${
                draft.trim() ? "bg-cyan text-white hover:bg-cyan/90 shadow-md" : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes slideUpSheet { from { transform: translateY(100%); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes slideDownSheet { from { transform: translateY(0); opacity: 1 } to { transform: translateY(100%); opacity: 0 } }
        @keyframes popIn { from { transform: scale(0.95) translateY(10px); opacity: 0 } to { transform: scale(1) translateY(0); opacity: 1 } }
        @keyframes popOut { from { transform: scale(1); opacity: 1 } to { transform: scale(0.95) translateY(10px); opacity: 0 } }
      `}</style>
    </div>,
    document.body
  );
}

function CommentList({ comments, loading, currentUser }: { comments: any[]; loading?: boolean; currentUser?: any }) {
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  if (loading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <li key={i} className="flex gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-nest-foreground/10 shrink-0" />
            <div className="flex-1 bg-muted rounded-2xl px-3 py-2.5 space-y-2">
              <div className="h-3 w-16 bg-nest-foreground/10 rounded" />
              <div className="h-4 w-3/4 bg-nest-foreground/10 rounded" />
            </div>
          </li>
        ))}
      </>
    );
  }

  const performDelete = async (commentId: string) => {
    try {
      await deleteCommentFn({ data: { commentId, userId: currentUser!.id } });
      toast.success("Comment deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  return (
    <>
      {comments.map((c) => (
        <li key={c.id} className="flex gap-3">
          <img src={c.user?.avatar || "https://api.dicebear.com/9.x/thumbs/svg?seed=fallback"} alt={c.user?.username} className="w-9 h-9 rounded-full object-cover bg-muted shrink-0" />
          <div className="flex-1 bg-muted rounded-2xl px-3 py-2 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold text-sm truncate text-black">{c.user?.username}</span>
              <span className="text-[10px] text-muted-foreground shrink-0">{formatDistanceToNow(new Date(c.createdAt))}</span>
            </div>
            <p className="text-sm leading-snug text-black">{c.text}</p>
            {currentUser?.user_metadata?.username === c.user?.username && (
              <div className="flex justify-end mt-1">
                <button
                  onClick={() => setDeletingCommentId(c.id)}
                  className="text-[11px] text-red-400 hover:text-red-500 font-semibold cursor-pointer px-1 py-0.5 rounded transition"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
      {comments.length === 0 && (
        <li className="text-xs text-muted-foreground text-center py-6">Be the first to leave something kind.</li>
      )}
      {deletingCommentId && (
        <ConfirmModal
          title="Delete comment?"
          description="Are you sure you want to remove this comment?"
          confirmText="Delete"
          variant="danger"
          onClose={() => setDeletingCommentId(null)}
          onConfirm={() => performDelete(deletingCommentId)}
        />
      )}
    </>
  );
}
