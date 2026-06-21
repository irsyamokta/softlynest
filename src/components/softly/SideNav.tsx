import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Plus, Star, Bell, User, Settings as SettingsIcon, LogOut, MoreHorizontal } from "lucide-react";
import { TiHome, TiHomeOutline } from "react-icons/ti";
import { BsChatText, BsChatTextFill } from "react-icons/bs";
import { RiSearchLine, RiSearchFill } from "react-icons/ri";
import { Logo } from "./Logo";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotificationsFn } from "@/lib/interaction.server";
import { getUnreadMessagesCountFn } from "@/lib/message.server";
import { supabase } from "@/lib/supabase";
import { playNotificationSound } from "@/lib/sounds";

type NavItem = {
  to: "/home" | "/search" | "/post" | "/favorites" | "/messages" | "/notifications";
  label: string;
  icon: any;
  activeIcon?: any;
  primary?: boolean;
};

const items: NavItem[] = [
  { to: "/home", label: "Home", icon: TiHomeOutline, activeIcon: TiHome },
  { to: "/search", label: "Search", icon: RiSearchLine, activeIcon: RiSearchFill },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/messages", label: "Messages", icon: BsChatText, activeIcon: BsChatTextFill },
  { to: "/notifications", label: "Notifications", icon: Bell },
];

export function SideNav() {
  const { pathname } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: () => getNotificationsFn({ data: user!.id }),
    enabled: !!user?.id,
  });

  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ["unread-messages", user?.id],
    queryFn: () => getUnreadMessagesCountFn({ data: user!.id }),
    enabled: !!user?.id,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const unreadNotificationsCount = notifications?.filter((n: any) => !n.read).length || 0;

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel(`sidenav-notifications-${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "Notification" }, (payload) => {
        if (payload.new?.userId === user.id) {
          refetch();
          playNotificationSound();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, refetch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    await signOut();
    navigate({ to: "/" });
  };

  const displayName = user?.user_metadata?.username || "You";
  const displayHandle = user?.user_metadata?.username ? `@${user.user_metadata.username}` : "@you.softly";

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 bg-cream text-nest-foreground p-5 gap-2 sticky top-0 h-screen border-r border-nest-foreground/10">
      <div className="bg-nest-foreground rounded-full px-5 py-1.5 self-start mb-4 shadow-sm">
        <Logo size="sm" />
      </div>
      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map(({ to, label, icon: Icon, activeIcon: ActiveIcon }) => {
            const active = pathname === to || pathname.startsWith(to + "/");
            const RenderIcon = active && ActiveIcon ? ActiveIcon : Icon;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-full font-bold text-sm transition ${
                    active
                      ? "bg-cyan text-white"
                      : "text-black hover:bg-black/5"
                  }`}
                >
                  <div className="relative">
                    {to === "/messages" || to === "/home" || to === "/search" ? (
                      <RenderIcon className="w-[22px] h-[22px]" />
                    ) : (
                      <RenderIcon className="w-5 h-5" strokeWidth={2.5} fill={active ? "currentColor" : "none"} />
                    )}
                    {to === "/notifications" && unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-pink"></span>
                      </span>
                    )}
                    {to === "/messages" && unreadMessagesCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pink text-[9px] font-bold text-white ring-2 ring-cream">
                        {unreadMessagesCount}
                      </span>
                    )}
                  </div>
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          to="/post"
          className="mt-4 flex items-center justify-center gap-2 rounded-full bg-pink text-cream font-bold py-3 hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} /> New post
        </Link>
      </nav>

      {/* Profile Dropdown */}
      <div className="relative mt-auto mb-4" ref={dropdownRef}>
        {dropdownOpen && (
          <div className="absolute bottom-14 left-0 w-full bg-white rounded-2xl soft-shadow py-2 border border-border/40 z-50 overflow-hidden">
            <Link 
              to="/profile" 
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-muted transition"
            >
              <User className="w-4 h-4 text-cyan" strokeWidth={2.5} />
              Profile
            </Link>
            <Link 
              to="/settings" 
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold hover:bg-muted transition"
            >
              <SettingsIcon className="w-4 h-4 text-cyan" strokeWidth={2.5} />
              Settings
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-pink hover:bg-pink/10 transition cursor-pointer text-left"
            >
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
              Log out
            </button>
          </div>
        )}
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-full hover:bg-black/5 transition cursor-pointer text-left"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gradient-to-br from-pink to-yellow">
            <img
              src={
                user?.user_metadata?.avatar_url ||
                `https://api.dicebear.com/9.x/thumbs/svg?seed=${user?.user_metadata?.username || "user"}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`
              }
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-black truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{displayHandle}</p>
          </div>
          <MoreHorizontal className="w-5 h-5 text-muted-foreground mr-2 shrink-0" />
        </button>
      </div>

      <div className="text-[11px] text-nest-foreground/60 px-2">
        © Softlynest — a soft place to land.
      </div>
    </aside>
  );
}
