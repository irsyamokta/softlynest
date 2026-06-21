import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfileByUsernameFn } from "@/lib/auth.server";
import { getMessagesFn, sendMessageFn, markMessagesAsReadFn } from "@/lib/message.server";
import { useAuth } from "@/contexts/AuthContext";
import { EmojiPicker } from "@/components/softly/EmojiPicker";
import { playMessageSound } from "@/lib/sounds";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_shell/messages/$messageId")({
  head: () => ({ meta: [{ title: "Chat — Softlynest" }] }),
  component: ChatRoom,
});

const MY_AVATAR = ""; // unused — avatar now fetched from DB via myProfile

function ChatRoom() {
  const { messageId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: targetProfile, isLoading } = useQuery({
    queryKey: ['profile', messageId],
    queryFn: () => getProfileByUsernameFn({ data: { username: messageId } }),
  });

  // Fetch current user's own profile from DB to get correct avatar
  const { data: myProfile } = useQuery({
    queryKey: ['my-profile', user?.id],
    queryFn: () => getProfileByUsernameFn({ data: { username: user!.user_metadata?.username } }),
    enabled: !!user?.user_metadata?.username,
  });

  const myAvatar =
    myProfile?.avatar ||
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.user_metadata?.username || "me"}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;

  const conversation = targetProfile ? {
    user: targetProfile.displayName || targetProfile.username,
    avatar: targetProfile.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${targetProfile.username}`,
  } : null;

  const { data: dbMessages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', user?.id, targetProfile?.id],
    queryFn: () => getMessagesFn({ data: { userId: user!.id, partnerId: targetProfile!.id } }),
    enabled: !!user?.id && !!targetProfile?.id,
    refetchInterval: 3000,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.id && targetProfile?.id) {
      markMessagesAsReadFn({ data: { currentUserId: user.id, senderId: targetProfile.id } }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      });
    }
  }, [user?.id, targetProfile?.id, dbMessages.length]);

  // Play sound immediately when a new message arrives via realtime,
  // without waiting for the 3-second polling interval.
  useEffect(() => {
    if (!user?.id || !targetProfile?.id) return;
    const channel = supabase
      .channel(`chat-sound-${user.id}-${targetProfile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `receiverId=eq.${user.id}`,
        },
        (payload) => {
          // Only play if message is from this specific conversation
          if (payload.new?.senderId === targetProfile.id) {
            playMessageSound();
            queryClient.invalidateQueries({
              queryKey: ["messages", user.id, targetProfile.id],
            });
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, targetProfile?.id, queryClient]);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const msgListRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef<number>(0);

  // Sound is handled by the realtime channel above — remove polling-based
  // sound to prevent double-play and false trigger when room first loads.

  // Show scrollbar only when content is actually scrollable
  useEffect(() => {
    const el = msgListRef.current;
    if (!el) return;
    const check = () => {
      if (el.scrollHeight > el.clientHeight) {
        el.classList.add("can-scroll");
      } else {
        el.classList.remove("can-scroll");
      }
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [dbMessages]);

  const { data: presenceState } = useQuery({
    queryKey: ['global-presence'],
    queryFn: () => queryClient.getQueryData(['global-presence']) || {},
    enabled: !!targetProfile?.id,
  });

  const isOnline = presenceState ? Object.keys(presenceState).includes(targetProfile?.id || "") : false;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, [input]);

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) { setInput((v) => v + emoji); return; }
    const start = el.selectionStart ?? input.length;
    const end = el.selectionEnd ?? input.length;
    const newVal = input.slice(0, start) + emoji + input.slice(end);
    setInput(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dbMessages]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate({ to: "/messages" });
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [navigate]);

  const sendMessageMutation = useMutation({
    mutationFn: sendMessageFn,
    onSuccess: () => {
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !user?.id || !targetProfile?.id) return;
    
    sendMessageMutation.mutate({
      data: {
        senderId: user.id,
        receiverId: targetProfile.id,
        text,
      }
    });
    
    setInput("");
    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-cream lg:bg-transparent">
        <div className="animate-pulse w-8 h-8 rounded-full bg-cyan/20"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-muted-foreground bg-nest">
        <p>Conversation not found.</p>
        <Link to="/messages" className="mt-4 text-cyan font-bold underline">← Back to Messages</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-cream lg:bg-transparent">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur border-b border-border/40 sticky top-0 z-10 shrink-0">
        <Link to="/messages" className="lg:hidden text-nest-foreground hover:text-cyan transition cursor-pointer p-1.5 -ml-1.5">
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
        </Link>
        <img src={conversation.avatar} alt={conversation.user} className="w-10 h-10 rounded-full object-cover bg-muted shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-black truncate">{conversation.user}</p>
          {isOnline ? (
            <p className="text-[11px] text-emerald-500 font-semibold transition-opacity duration-300">Online</p>
          ) : (
            <p className="text-[11px] text-muted-foreground transition-opacity duration-300">Offline</p>
          )}
        </div>
      </div>

      {/* Message List */}
      <div ref={msgListRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 chat-scroll">
        {dbMessages.map((msg) => {
          const isMe = msg.senderId === user?.id;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              {!isMe ? (
                <img src={conversation.avatar} alt={conversation.user} className="w-8 h-8 rounded-full object-cover shrink-0 mb-0.5" />
              ) : (
                <img src={myAvatar} alt="me" className="w-8 h-8 rounded-full object-cover shrink-0 mb-0.5" />
              )}

              {/* Bubble */}
              <div className={`max-w-[72%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2.5 rounded-3xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-cyan text-white rounded-br-md"
                      : "bg-white text-black border border-border/40 rounded-bl-md soft-shadow"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && (
                    <span className="ml-1 text-cyan">{msg.read ? "✓✓" : "✓"}</span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white/80 backdrop-blur border-t border-border/40 px-3 py-3 flex items-end gap-2 shrink-0">
        <EmojiPicker onEmojiSelect={insertEmoji} />
        <div className="flex-1 bg-muted rounded-3xl px-4 py-2.5 flex items-end min-h-[48px]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something kind… 💬"
            rows={1}
            style={{ height: "auto", maxHeight: "160px" }}
            className="w-full bg-transparent text-base outline-none resize-none leading-snug text-black placeholder:text-muted-foreground overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
            input.trim() ? "bg-cyan text-white hover:bg-cyan/90 shadow-md" : "bg-muted text-muted-foreground"
          }`}
          aria-label="Send message"
        >
          <Send className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
