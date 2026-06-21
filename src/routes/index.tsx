import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/softly/Logo";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Softlynest — A Safe Place to Breathe, Share, and Heal" },
      { name: "description", content: "Sign in to Softlynest, a gentle social space for sharing, healing, and support." },
    ],
  }),
  component: SplashLogin,
});

function SplashLogin() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/home" });
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Logged in successfully! Welcome back! 🎉");
      navigate({ to: "/home" });
    } catch (err: any) {
      const msg = err.message?.includes("Invalid login credentials")
        ? "Incorrect email or password."
        : err.message || "Failed to log in, please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setShowLogin(true), 1800);
    return () => clearTimeout(t);
  }, []);

  if (authLoading || user) return null;

  if (!showLogin) {
    return (
      <div className="min-h-screen bg-nest flex flex-col">
        <div className="h-16 scallop-bottom bg-black/15" />
        <div className="flex-1 flex flex-col px-6">
          <div className="flex-1 flex items-center justify-center">
            <Logo size="xl" />
          </div>
          <div className="pb-12 flex justify-center">
            <p className="text-cream/90 font-medium tracking-wide text-center">
              A Safe Place to <span className="text-cyan">Breathe</span>, Share, and <span className="text-cyan">Heal</span>
            </p>
          </div>
        </div>
        <div className="h-16 scallop-top bg-black/15" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nest flex flex-col">
      <div className="h-16 scallop-bottom bg-nest-foreground shrink-0" />
      
      <div className="flex-1 flex flex-col md:justify-center">
        <div className="flex flex-col items-center pt-6 pb-12 md:pt-0 shrink-0">
          <Logo size="xl" />
        </div>

        <div className="flex-1 md:flex-none bg-white w-full rounded-t-[40px] md:max-w-md md:mx-auto md:rounded-[40px] shadow-sm flex flex-col px-8 pt-12 pb-8">
          <form onSubmit={handleLogin} className="w-full max-w-sm mx-auto flex flex-col flex-1">
            <div className="space-y-8">
              <label className="block">
                <span className="text-xl font-bold text-nest-foreground">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                  placeholder="example@gmail.com"
                  className={`mt-1 w-full bg-transparent border-b px-0 py-2 text-base outline-none transition text-foreground placeholder:text-muted-foreground ${errorMsg ? "border-red-500 focus:border-red-500" : "border-nest-foreground focus:border-cyan"}`}
                />
              </label>
              <label className="block">
                <span className="text-xl font-bold text-nest-foreground">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                  placeholder="Your password"
                  className={`mt-1 w-full bg-transparent border-b px-0 py-2 text-base outline-none transition text-foreground placeholder:text-muted-foreground ${errorMsg ? "border-red-500 focus:border-red-500" : "border-nest-foreground focus:border-cyan"}`}
                />
              </label>
              {errorMsg && (
                <p className="text-sm text-red-500 font-medium -mt-4 animate-in fade-in slide-in-from-top-1">
                  ⚠ {errorMsg}
                </p>
              )}
            </div>

            <div className="mt-auto md:mt-12 pt-16 md:pt-4 space-y-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full cursor-pointer rounded-full bg-cyan text-white font-bold py-4 text-lg active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>
              <Link to="/register" className="block text-center text-lg font-bold text-nest-foreground hover:opacity-80 transition">
                REGISTER
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      <div className="hidden md:block h-16 scallop-top bg-nest-foreground shrink-0" />
    </div>
  );
}
