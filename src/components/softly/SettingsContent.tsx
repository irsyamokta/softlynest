import { useState, useEffect } from "react";
import { Save, Trash2, RefreshCw } from "lucide-react";
import { ConfirmModal } from "./ConfirmModal";
import { updateProfileFn } from "@/lib/auth.server";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export function SettingsContent() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [password, setPassword] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Populate fields from auth context + user metadata
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      // Username is stored in user_metadata when registering
      setUsername(user.user_metadata?.username || "");
      setBio(user.user_metadata?.bio || "");
      setAvatarUrl(user.user_metadata?.avatar_url || `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.user_metadata?.username || "user"}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);

      // 1. Update Prisma DB (username, bio, avatar)
      await updateProfileFn({
        data: {
          id: user.id,
          username,
          bio,
          avatar: avatarUrl,
        }
      });

      // 2. Also update Supabase user_metadata so username stays in sync
      await supabase.auth.updateUser({
        data: { username, bio, avatar_url: avatarUrl },
      });

      // 3. Update password if provided
      if (password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      }

      toast.success("Profil berhasil diperbarui! ✨");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setAvatarUrl(`https://api.dicebear.com/9.x/thumbs/svg?seed=${randomSeed}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`);
  };

  return (
    <div className="px-4 py-4 md:px-0 md:py-0">
      <div className="flex items-center justify-between mb-6">
        <h2 className="hidden md:block text-2xl font-extrabold">Settings</h2>
      </div>

      <div className="pb-8 w-full">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Edit Profile</p>
        
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 md:p-6 soft-shadow border border-border/60 flex flex-col gap-5">
          {/* Avatar */}
          <div className="self-center relative group cursor-pointer mb-2" onClick={handleRefreshAvatar}>
            <img src={avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover bg-muted transition group-active:scale-95" />
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center group-active:scale-95">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-cyan rounded-full border-2 border-white flex items-center justify-center shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">Email</label>
              <input 
                type="email" 
                value={email}
                disabled
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black/50 cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground pl-1">Email tidak bisa diubah dari sini</p>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username Anda"
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Ceritakan sedikit tentang dirimu..."
                className="w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-muted-foreground uppercase pl-1">Password Baru</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah"
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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>

        <div className="mt-8">
          <p className="text-[11px] font-extrabold text-red-500 uppercase tracking-wider mb-3 pl-1">Danger Zone</p>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="w-full rounded-xl border-2 border-red-100 bg-red-50/50 text-red-500 font-bold py-3.5 flex items-center justify-center gap-2 transition hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} /> Hapus Akun
          </button>
        </div>
      </div>

      {deleteModalOpen && (
        <ConfirmModal
          title="Hapus Akun?"
          description="Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen."
          confirmText="Hapus"
          cancelText="Batal"
          variant="danger"
          onConfirm={() => {
            alert("Account deleted!");
            setDeleteModalOpen(false);
          }}
          onClose={() => setDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}
