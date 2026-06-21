import { createFileRoute, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PhoneFrame } from "@/components/softly/PhoneFrame";
import { syncUserToPrismaFn } from "@/lib/auth.server";
import { TopBar } from "@/components/softly/TopBar";
import { BottomNav } from "@/components/softly/BottomNav";
import { SideNav } from "@/components/softly/SideNav";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useAppBadge } from "@/hooks/useAppBadge";
import { preloadSounds } from "@/lib/sounds";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  const matchRoute = useMatchRoute();
  const isChatRoomActive = matchRoute({ to: "/messages/$messageId", fuzzy: true });
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useAppBadge();

  // Pre-fetch and decode sound file early so first notification plays instantly
  useEffect(() => { preloadSounds(); }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user) {
      const email = user.email || "";
      const username = user.user_metadata?.username || email.split("@")[0] || "user";
      syncUserToPrismaFn({ data: { id: user.id, email, username } }).catch(async (err) => {
        console.error("Shell layout user sync error:", err);
        // If the auth session is no longer valid (e.g. user deleted from auth),
        // force sign out so they don't get stuck in a broken state.
        const { data } = await supabase.auth.getUser();
        if (!data.user) {
          await signOut();
          navigate({ to: "/" });
        }
      });
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel('global-presence', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      queryClient.setQueryData(['global-presence'], state);
    }).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ online_at: new Date().toISOString() });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  if (loading || !user) {
    return (
      <PhoneFrame>
        <div className="flex-1 w-full flex items-center justify-center bg-white">
          <img src="/favicon.svg" alt="Loading" className="w-16 h-16 animate-pulse" />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="flex flex-1 h-full w-full">
        <SideNav />
        <div className="flex-1 flex flex-col min-w-0 bg-cream">
          <div className={`md:hidden shrink-0 z-50 ${isChatRoomActive ? "hidden" : ""}`}>
            <TopBar />
          </div>
          <main className="flex-1 overflow-y-auto bg-cream relative flex flex-col">
            <div className={`w-full md:max-w-5xl md:mx-auto md:px-6 md:py-8 flex flex-col flex-1 min-h-full ${isChatRoomActive || matchRoute({ to: "/messages", fuzzy: true }) ? "" : "pb-6"}`}>
              <Outlet />
            </div>
          </main>
          <div className={`md:hidden shrink-0 z-50 ${isChatRoomActive ? "hidden" : ""}`}>
            <BottomNav />
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
