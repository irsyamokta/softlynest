import { Link, useLocation } from "@tanstack/react-router";
import { Plus, Star } from "lucide-react";
import { TiHome, TiHomeOutline } from "react-icons/ti";
import { BsChatText, BsChatTextFill } from "react-icons/bs";
import { RiSearchLine, RiSearchFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getUnreadMessagesCountFn } from "@/lib/message.server";
import { useAuth } from "@/contexts/AuthContext";
import { playMessageSound } from "@/lib/sounds";

type NavItem = { to: "/home" | "/search" | "/post" | "/favorites" | "/messages"; label: string; icon: any; activeIcon?: any; center?: boolean };
const items: NavItem[] = [
  { to: "/home", label: "Home", icon: TiHomeOutline, activeIcon: TiHome },
  { to: "/search", label: "Search", icon: RiSearchLine, activeIcon: RiSearchFill },
  { to: "/post", label: "Post", icon: Plus, center: true },
  { to: "/favorites", label: "Favorites", icon: Star },
  { to: "/messages", label: "Messages", icon: BsChatText, activeIcon: BsChatTextFill },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const { data: unreadMessagesCount = 0 } = useQuery({
    queryKey: ["unread-messages", user?.id],
    queryFn: () => getUnreadMessagesCountFn({ data: user!.id }),
    enabled: !!user?.id,
    refetchInterval: 5000,
  });

  const prevUnreadRef = useRef<number>(0);

  useEffect(() => {
    const prev = prevUnreadRef.current;
    if (prev > 0 && unreadMessagesCount > prev) {
      playMessageSound();
    }
    prevUnreadRef.current = unreadMessagesCount;
  }, [unreadMessagesCount]);

  return (
    <nav className="sticky bottom-0 z-20 bg-nest px-4 pt-3 pb-4 rounded-t-3xl">
      <ul className="flex items-center justify-around">
        {items.map(({ to, label, icon: Icon, activeIcon: ActiveIcon, center }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          const RenderIcon = active && ActiveIcon ? ActiveIcon : Icon;
          
          if (center) {
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-label={label}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan text-primary-foreground -mt-8 ring-4 ring-nest shadow-lg active:scale-95 transition"
                >
                  <RenderIcon className="w-7 h-7" strokeWidth={2.5} />
                </Link>
              </li>
            );
          }
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                className={`relative flex items-center justify-center w-11 h-11 rounded-full transition ${
                  active ? "text-white" : "text-cream/90 hover:text-cream"
                }`}
              >
                {to === "/messages" || to === "/home" || to === "/search" ? (
                  <RenderIcon className="w-6 h-6" />
                ) : (
                  <RenderIcon className="w-6 h-6" strokeWidth={active ? 0 : 2.5} fill={active ? "currentColor" : "none"} />
                )}
                {to === "/messages" && unreadMessagesCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-pink text-[8px] font-bold text-white ring-2 ring-nest">
                    {unreadMessagesCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
