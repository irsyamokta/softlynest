import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Logo } from "@/components/softly/Logo";
import { supabase } from "@/lib/supabase";
import { syncUserToPrismaFn, checkUsernameFn } from "@/lib/auth.server";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Softlynest" }] }),
  component: Register,
});

type FieldErrors = {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
};

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/home" });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || user) return null;

  const clearError = (field: keyof FieldErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FieldErrors = {};

    if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      setLoading(true);

      // 1. Check if username is already taken in our DB
      const { isTaken } = await checkUsernameFn({ data: username });
      if (isTaken) {
        setErrors({ username: `Username @${username} is already taken.` });
        toast.error(`Username @${username} is already taken!`);
        setLoading(false);
        return;
      }

      // 2. Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) {
        const isEmailTaken =
          error.status === 422 ||
          error.message.toLowerCase().includes("already registered");
        const msg = isEmailTaken
          ? "Email is already registered. Please log in."
          : error.message;
        setErrors({ email: isEmailTaken ? msg : undefined });
        toast.error(msg);
        setLoading(false);
        return;
      }
      if (!data.user) throw new Error("No user returned from Supabase");

      // 3. Sync to Prisma DB
      try {
        await syncUserToPrismaFn({ data: { id: data.user.id, email, username } });
      } catch (dbErr: any) {
        console.error("DB sync error (non-fatal):", dbErr);
      }

      if (data.session) {
        toast.success("Account successfully created! 🎉");
        navigate({ to: "/home" });
      } else {
        toast.success("Account created! Please check your email for confirmation, then log in.");
        navigate({ to: "/" });
      }
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof FieldErrors) =>
    `mt-1 w-full bg-transparent border-b px-0 py-2 text-base outline-none transition text-foreground placeholder:text-muted-foreground ${
      errors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-nest-foreground focus:border-cyan"
    }`;

  return (
    <div className="min-h-screen bg-nest flex flex-col">
      <div className="h-16 scallop-bottom bg-nest-foreground shrink-0" />

      <div className="flex-1 flex flex-col md:justify-center">
        <div className="flex flex-col items-center pt-6 pb-12 md:pt-0 shrink-0">
          <Logo size="xl" />
        </div>

        <div className="flex-1 md:flex-none bg-white w-full rounded-t-[40px] md:max-w-md md:mx-auto md:rounded-[40px] shadow-sm flex flex-col px-8 pt-12 pb-8">
          <form onSubmit={handleRegister} className="w-full max-w-sm mx-auto flex flex-col flex-1">
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block">
                  <span className="text-xl font-bold text-nest-foreground">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    placeholder="example@gmail.com"
                    className={inputClass("email")}
                  />
                </label>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    ⚠ {errors.email}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block">
                  <span className="text-xl font-bold text-nest-foreground">Username</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); clearError("username"); }}
                    placeholder="e.g., softlyuser"
                    className={inputClass("username")}
                  />
                </label>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    ⚠ {errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block">
                  <span className="text-xl font-bold text-nest-foreground">Create password</span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                    placeholder="Min. 6 characters"
                    className={inputClass("password")}
                  />
                </label>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    ⚠ {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block">
                  <span className="text-xl font-bold text-nest-foreground">Confirm password</span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
                    placeholder="Repeat password"
                    className={inputClass("confirmPassword")}
                  />
                </label>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                    ⚠ {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-auto md:mt-10 pt-8 md:pt-4 space-y-4">
              <button
                disabled={loading}
                type="submit"
                className="w-full cursor-pointer rounded-full bg-cyan text-white font-bold py-4 text-lg active:scale-[0.98] transition disabled:opacity-50"
              >
                {loading ? "REGISTERING..." : "REGISTER"}
              </button>
              <Link to="/" className="block text-center text-lg font-bold text-nest-foreground hover:opacity-80 transition">
                LOGIN
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden md:block h-16 scallop-top bg-nest-foreground shrink-0" />
    </div>
  );
}
