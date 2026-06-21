import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Settings as SettingsIcon, LogOut, User } from "lucide-react";
import { Logo } from "./Logo";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getNotificationsFn } from "@/lib/interaction.server";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { playNotificationSound } from "@/lib/sounds";

export function TopBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: notifications, refetch } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getNotificationsFn({ data: user!.id }),
    enabled: !!user?.id,
  });

  const unreadCount = notifications?.filter((n: any) => !n.read).length || 0;

  useEffect(() => {
    if (user?.id) {
      const channel = supabase.channel(`topbar-notifications-${user.id}`)
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "Notification" }, (payload) => {
          if (payload.new?.userId === user.id) {
            refetch();
            if (payload.new.actorId !== user.id) {
              toast("You have a new notification!");
              playNotificationSound();
            }
          }
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
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

  const handleLogout = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate({ to: "/" });
  };

  const username = user?.user_metadata?.username || "user";
  const avatarUrl = user?.user_metadata?.avatar_url ||
    `https://api.dicebear.com/9.x/thumbs/svg?seed=${username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;

  return (
    <header className="flex items-center justify-between px-5 pt-5 pb-3 bg-cream">
      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="Profile menu"
            className="block cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full ring-2 ring-cream overflow-hidden bg-gradient-to-br from-pink to-yellow">
              <img
                src={avatarUrl}
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute top-12 left-0 w-48 bg-white rounded-2xl soft-shadow py-2 border border-border/40 z-50 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/40">
                <p className="text-sm font-bold text-black truncate">{username}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
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
        </div>

        <Link to="/notifications" aria-label="Notifications" className="relative text-gray-400 hover:text-gray-500">
          <Bell className="w-7 h-7" strokeWidth={2.5} fill="currentColor" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink ring-2 ring-cream"></span>
            </span>
          )}
        </Link>
      </div>
      <div className="bg-nest-foreground rounded-full px-5 py-1.5 shadow-sm">
        <Logo size="sm" />
      </div>
    </header>
  );
}
