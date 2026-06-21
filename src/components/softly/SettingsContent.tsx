import { useState, useEffect } from "react";
import { Save, Trash2, RefreshCw, Bell, BellOff, BellRing } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import { updateProfileFn, deleteAccountFn } from "@/lib/auth.server";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

// ── Notification permission helpers ──────────────────────────────────────────
type NotifPermission = "granted" | "denied" | "default" | "unsupported";

function getPermissionStatus(): NotifPermission {
  if (typeof window === "undefined" || !("Notification" in window))
    return "unsupported";
  return Notification.permission as NotifPermission;
}

async function requestPermission(): Promise<NotifPermission> {
  if (!("Notification" in window)) return "unsupported";
  const result = await Notification.requestPermission();
  return result as NotifPermission;
}

const NOTIF_PREF_KEY = "softlynest_notif_enabled";
function getNotifPref(): boolean {
  try { return localStorage.getItem(NOTIF_PREF_KEY) !== "false"; }
  catch { return true; }
}
function setNotifPref(val: boolean) {
  try { localStorage.setItem(NOTIF_PREF_KEY, val ? "true" : "false"); }
  catch {}
}

function NotificationSettings() {
  const [permission, setPermission] = useState<NotifPermission>(getPermissionStatus);
  const [enabled, setEnabled] = useState(getNotifPref);

  const handleToggle = async () => {
    if (permission === "unsupported") {
      toast.error("Your browser doesn't support notifications.");
      return;
    }
    if (permission === "denied") {
      toast("Notifications are blocked. Open your browser or OS settings to allow them.", {
        duration: 5000,
      });
      return;
    }
    if (permission === "default") {
      const result = await requestPermission();
      setPermission(result);
      if (result === "granted") {
        setEnabled(true);
        setNotifPref(true);
        toast.success("Notifications enabled! 🔔");
      } else if (result === "denied") {
        setEnabled(false);
        setNotifPref(false);
        toast.error("Permission denied. You can change this in your browser settings.");
      }
      return;
    }
    const next = !enabled;
    setEnabled(next);
    setNotifPref(next);
    toast.success(next ? "Notifications enabled 🔔" : "Notifications disabled 🔕");
  };

  const isOn = enabled && permission === "granted";

  const statusConfig: Record<NotifPermission, { label: string; desc: string; color: string; Icon: any }> = {
    granted: {
      label: isOn ? "Enabled" : "Disabled",
      desc: isOn
        ? "You'll receive notifications for new messages and interactions."
        : "Notifications are off. Toggle to enable.",
      color: isOn ? "text-emerald-500" : "text-muted-foreground",
      Icon: isOn ? BellRing : BellOff,
    },
    default: {
      label: "Not allowed",
      desc: "Permission hasn't been granted yet. Tap Allow to enable notifications.",
      color: "text-amber-500",
      Icon: Bell,
    },
    denied: {
      label: "Blocked",
      desc: "Notifications are blocked by your browser. Go to browser settings → Site permissions → allow notifications.",
      color: "text-red-500",
      Icon: BellOff,
    },
    unsupported: {
      label: "Not supported",
      desc: "Your browser doesn't support push notifications.",
      color: "text-muted-foreground",
      Icon: BellOff,
    },
  };

  const cfg = statusConfig[permission];

  return (
    <div className="mt-8">
      <p className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
        Notifications
      </p>
      <div className="bg-white rounded-3xl p-5 soft-shadow border border-border/60">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 ${cfg.color}`}>
              <cfg.Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-bold ${cfg.color}`}>{cfg.label}</p>
              <p className="text-[11px] text-muted-foreground leading-snug">{cfg.desc}</p>
            </div>
          </div>

          {permission === "granted" && (
            <button
              onClick={handleToggle}
              role="switch"
              aria-checked={isOn}
              aria-label="Toggle notifications"
              className={`shrink-0 relative inline-flex w-14 h-7 rounded-full cursor-pointer
                transition-colors duration-300 ease-in-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2
                ${isOn ? "bg-gradient-to-r from-cyan to-cyan/80" : "bg-black/15"}`}
            >
              <span
                className={`pointer-events-none absolute top-0.5 w-6 h-6 rounded-full bg-white
                  shadow-md transition-transform duration-300 ease-in-out
                  ${isOn ? "translate-x-7" : "translate-x-0.5"}`}
              />
            </button>
          )}

          {permission === "default" && (
            <button
              onClick={handleToggle}
              className="shrink-0 px-4 py-1.5 rounded-full bg-cyan text-white text-xs font-bold cursor-pointer hover:bg-cyan/90 transition"
            >
              Allow
            </button>
          )}

          {permission === "denied" && (
            <span className="shrink-0 text-xs font-bold text-red-400">Blocked</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function SettingsContent() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setUsername(user.user_metadata?.username || "");
      setBio(user.user_metadata?.bio || "");
      setAvatarUrl(
        user.user_metadata?.avatar_url ||
          `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.user_metadata?.username || "user"}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`,
      );
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      await updateProfileFn({ data: { id: user.id, username, bio, avatar: avatarUrl } });
      await supabase.auth.updateUser({ data: { username, bio, avatar_url: avatarUrl } });
      if (password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      }
      toast.success("Profile updated! ✨");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    setAvatarUrl(
      `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`,
    );
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      setDeleting(true);

      // 1. Delete DB data + Cloudinary media via server function
      await deleteAccountFn({ data: user.id });

      // 2. Delete from Supabase Auth using the user's own session token.
      //    This does NOT require service role key — Supabase allows users
      //    to delete themselves via their active JWT.
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (accessToken) {
        const supabaseUrl =
          import.meta.env.VITE_SUPABASE_URL ||
          "https://vzhqofnznrantdjptvoo.supabase.co";

        // Call Supabase Auth REST API — user can delete their own account
        await fetch(`${supabaseUrl}/auth/v1/user`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          },
        });
      }

      // 3. Clear all cached queries
      queryClient.clear();

      // 4. Sign out and redirect
      await signOut();
      toast.success("Your account has been permanently deleted.");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account. Please try again.");
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="hidden md:block text-2xl font-extrabold">Settings</h2>
      </div>

      <div className="pb-8 w-full">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Edit Profile
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-5 md:p-6 soft-shadow border border-border/60 flex flex-col gap-5"
        >
          {/* Avatar */}
          <div
            className="self-center relative group cursor-pointer mb-2"
            onClick={handleRefreshAvatar}
          >
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover bg-muted transition group-active:scale-95"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center group-active:scale-95">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-cyan rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black/50 cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground pl-1">
                Email cannot be changed here.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ""))
                }
                placeholder="Your username"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                spellCheck={false}
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell us a little about yourself…"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan text-primary-foreground font-bold py-3.5 flex items-center justify-center gap-2 transition hover:bg-cyan/90 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" strokeWidth={2.5} />
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>

        <NotificationSettings />

        <div className="mt-8">
          <p className="text-[11px] font-extrabold text-red-500 uppercase tracking-wider mb-3 pl-1">
            Danger Zone
          </p>
          <button
            onClick={() => setDeleteModalOpen(true)}
            disabled
            className="w-full rounded-xl border-2 border-red-100 bg-red-50/50 text-red-500 font-bold py-3.5 flex items-center justify-center gap-2 transition hover:bg-red-200 hover:text-white hover:border-red-200 cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
            {deleting ? "Deleting account…" : "Delete Account"}
          </button>
        </div>
      </div>

      {deleteModalOpen && (
        <ConfirmModal
          title="Delete Account?"
          description="This action cannot be undone. All your posts, messages, and data will be permanently deleted."
          confirmText={deleting ? "Deleting…" : "Delete"}
          cancelText="Cancel"
          variant="danger"
          onConfirm={handleDeleteAccount}
          onClose={() => !deleting && setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
