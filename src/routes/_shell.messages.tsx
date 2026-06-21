import { createFileRoute, useNavigate, Outlet, useMatchRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trash2, Search, MessageSquare, Users } from "lucide-react";
import { EmptyState } from "@/components/softly/EmptyState";
import { getChatContactsFn, searchUsersFn } from "@/lib/auth.server";
import { getConversationsFn } from "@/lib/message.server";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";

export const Route = createFileRoute("/_shell/messages")({
  head: () => ({ meta: [{ title: "Messages — Softlynest" }] }),
  component: Messages,
});

function SwipeableMessage({ m, onDelete }: { m: any; onDelete: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-2xl mb-2.5">
      {/* Desktop hover delete button — visible without swiping */}
      <button
        onClick={onDelete}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition cursor-pointer z-10"
        aria-label="Delete conversation"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Non-swipeable card */}
      <Link
        to="/messages/$messageId"
        params={{ messageId: m.username }}
        className="flex items-center gap-3 bg-cream rounded-2xl px-3 py-3 soft-shadow border border-border/60 hover:bg-black/5 transition relative z-10 group"
      >
        <img src={m.avatar} alt={m.user} className="w-11 h-11 rounded-full object-cover bg-muted shrink-0 pointer-events-none" />
        <div className="flex-1 min-w-0 pointer-events-none">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold text-sm truncate">{m.user}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">
              {m.latestMessage?.createdAt ? formatDistanceToNow(new Date(m.latestMessage.createdAt), { addSuffix: true }) : ""}
            </span>
          </div>
          <p className={`text-xs truncate ${m.unreadCount > 0 ? "font-bold text-black" : "text-foreground/80"}`}>
            {m.latestMessage?.withdrawn 
              ? <span className="italic text-muted-foreground">🚫 This message was withdrawn</span>
              : (m.latestMessage?.text || m.preview || "")}
          </p>
        </div>
        {m.unreadCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan text-white text-[10px] font-bold shrink-0 pointer-events-none">
            {m.unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}


function Messages() {
  const { user } = useAuth();
  const matchRoute = useMatchRoute();
  const isChatRoomActive = matchRoute({ to: "/messages/$messageId", fuzzy: true });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: searchResults } = useQuery({
    queryKey: ['search-users', debouncedSearch],
    queryFn: () => searchUsersFn({ data: { query: debouncedSearch, currentUserId: user?.id } }),
    enabled: !!user?.id && debouncedSearch.length > 0,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['conversations', user?.id],
    queryFn: () => getConversationsFn({ data: user!.id }),
    enabled: !!user?.id,
    refetchInterval: 3000,
  });

  const { data: contacts } = useQuery({
    queryKey: ['chat-contacts', user?.id],
    queryFn: () => getChatContactsFn({ data: user!.id }),
    enabled: !!user?.id && messages.length === 0,
  });

  const handleDelete = (id: string) => {
    // We would need a deleteConversationFn here to actually delete it from DB
    // For now, it's just visually handled or we can leave it as a placeholder.
    console.log("Delete conversation", id);
  };

  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-0 w-full md:overflow-hidden md:rounded-3xl md:border md:border-border/40 shadow-none md:shadow-xl md:shadow-black/5 bg-cream md:bg-white/50">
      {/* Left panel: List */}
      <div className={`w-full flex-col min-h-0 border-r border-border/40 bg-cream lg:w-[350px] md:bg-transparent ${isChatRoomActive ? "hidden lg:flex" : "flex"}`}>
        <div className="px-4 py-4 lg:py-6 flex-1 overflow-y-auto">
          <h2 className="text-2xl font-extrabold mb-4 px-1">Messages</h2>
          
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users to chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border/40 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan/20 transition-shadow soft-shadow"
            />
          </div>

          {searchQuery ? (
            <div className="space-y-4">
              <div className="px-1 mb-2">
                <p className="text-sm font-bold text-black">Search Results</p>
              </div>
              <div className="space-y-2">
                {searchResults?.length ? searchResults.map((u: any) => (
                  <Link
                    key={u.id}
                    to="/messages/$messageId"
                    params={{ messageId: u.username }}
                    className="flex items-center gap-3 bg-white hover:bg-black/5 transition rounded-2xl px-3 py-3 soft-shadow border border-border/60"
                  >
                    <img src={u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}`} alt={u.username} className="w-10 h-10 rounded-full object-cover shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-black truncate">{u.displayName || u.username}</p>
                      <p className="text-xs text-muted-foreground truncate">@{u.username}</p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No users found.</p>
                )}
              </div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((m) => (
              <SwipeableMessage key={m.id} m={m} onDelete={() => handleDelete(m.id)} />
            ))
          ) : contacts && contacts.length > 0 ? (
            <div className="space-y-4">
              <div className="px-1 mb-2">
                <p className="text-sm font-bold text-black flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan" /> Start a new chat
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Select a friend to message.</p>
              </div>
              <div className="space-y-2">
                {contacts.map((c: any) => (
                  <Link
                    key={c.id}
                    to="/messages/$messageId"
                    params={{ messageId: c.username }}
                    className="flex items-center gap-3 bg-white hover:bg-black/5 transition rounded-2xl px-3 py-3 soft-shadow border border-border/60"
                  >
                    <img src={c.avatar} alt={c.username} className="w-10 h-10 rounded-full object-cover shrink-0 bg-gradient-to-br from-pink/60 to-yellow/60" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-black truncate">{c.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">@{c.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              description="Your inbox is quiet. Start a conversation by finding someone to message."
              action={
                <Link
                  to="/search"
                  search={{ q: "" }}
                  className="inline-block mt-2 px-6 py-2.5 rounded-full bg-cyan text-white font-bold text-sm hover:bg-cyan/90 transition shadow-sm"
                >
                  Find people
                </Link>
              }
            />
          )}
        </div>
      </div>

      {/* Right panel: Chat Room or Index */}
      <div className={`flex-1 min-h-0 flex flex-col bg-cream lg:bg-transparent overflow-hidden ${isChatRoomActive ? "flex" : "hidden lg:flex"}`}>
        <Outlet />
      </div>
    </div>
  );
}

