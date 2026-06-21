import { t as supabase } from "./supabase-DsUV4Div.js";
import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { s as syncUserToPrismaFn, t as checkUsernameFn } from "./auth.server-C3pOWsG0.js";
import { t as Logo } from "./Logo-4c3S_ikB.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
//#region src/routes/register.tsx?tsr-split=component
function Register() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	const { user, loading: authLoading } = useAuth();
	useEffect(() => {
		if (!authLoading && user) navigate({ to: "/home" });
	}, [
		user,
		authLoading,
		navigate
	]);
	if (authLoading || user) return null;
	const clearError = (field) => setErrors((prev) => ({
		...prev,
		[field]: void 0
	}));
	const handleRegister = async (e) => {
		e.preventDefault();
		const newErrors = {};
		if (username.length < 3) newErrors.username = "Username minimal 3 karakter.";
		if (password.length < 6) newErrors.password = "Password minimal 6 karakter.";
		if (password !== confirmPassword) newErrors.confirmPassword = "Password tidak cocok.";
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			toast.error("Mohon perbaiki data yang diisi.");
			return;
		}
		try {
			setLoading(true);
			const { isTaken } = await checkUsernameFn({ data: username });
			if (isTaken) {
				setErrors({ username: `Username @${username} sudah dipakai.` });
				toast.error(`Username @${username} sudah dipakai!`);
				setLoading(false);
				return;
			}
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { username } }
			});
			if (error) {
				const isEmailTaken = error.status === 422 || error.message.toLowerCase().includes("already registered");
				const msg = isEmailTaken ? "Email sudah terdaftar. Silakan login." : error.message;
				setErrors({ email: isEmailTaken ? msg : void 0 });
				toast.error(msg);
				setLoading(false);
				return;
			}
			if (!data.user) throw new Error("No user returned from Supabase");
			try {
				await syncUserToPrismaFn({ data: {
					id: data.user.id,
					email,
					username
				} });
			} catch (dbErr) {
				console.error("DB sync error (non-fatal):", dbErr);
			}
			if (data.session) {
				toast.success("Akun berhasil dibuat! 🎉");
				navigate({ to: "/home" });
			} else {
				toast.success("Akun dibuat! Cek email Anda untuk konfirmasi, lalu login.");
				navigate({ to: "/" });
			}
		} catch (err) {
			console.error("Register error:", err);
			toast.error(err.message || "Gagal mendaftar.");
		} finally {
			setLoading(false);
		}
	};
	const inputClass = (field) => `mt-1 w-full bg-transparent border-b px-0 py-2 text-base outline-none transition text-foreground placeholder:text-muted-foreground ${errors[field] ? "border-red-500 focus:border-red-500" : "border-nest-foreground focus:border-cyan"}`;
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-nest flex flex-col",
		children: [
			/* @__PURE__ */ jsx("div", { className: "h-16 scallop-bottom bg-nest-foreground shrink-0" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 flex flex-col md:justify-center",
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex flex-col items-center pt-6 pb-12 md:pt-0 shrink-0",
					children: /* @__PURE__ */ jsx(Logo, { size: "xl" })
				}), /* @__PURE__ */ jsx("div", {
					className: "flex-1 md:flex-none bg-white w-full rounded-t-[40px] md:max-w-md md:mx-auto md:rounded-[40px] shadow-sm flex flex-col px-8 pt-12 pb-8",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: handleRegister,
						className: "w-full max-w-sm mx-auto flex flex-col flex-1",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Email"
									}), /* @__PURE__ */ jsx("input", {
										type: "email",
										required: true,
										value: email,
										onChange: (e) => {
											setEmail(e.target.value);
											clearError("email");
										},
										placeholder: "example@gmail.com",
										className: inputClass("email")
									})]
								}), errors.email && /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.email]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Username"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										required: true,
										value: username,
										onChange: (e) => {
											setUsername(e.target.value);
											clearError("username");
										},
										placeholder: "e.g., softlyuser",
										className: inputClass("username")
									})]
								}), errors.username && /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.username]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Buat password"
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										required: true,
										value: password,
										onChange: (e) => {
											setPassword(e.target.value);
											clearError("password");
										},
										placeholder: "Min. 6 karakter",
										className: inputClass("password")
									})]
								}), errors.password && /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.password]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("label", {
									className: "block",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Konfirmasi password"
									}), /* @__PURE__ */ jsx("input", {
										type: "password",
										required: true,
										value: confirmPassword,
										onChange: (e) => {
											setConfirmPassword(e.target.value);
											clearError("confirmPassword");
										},
										placeholder: "Ulangi password",
										className: inputClass("confirmPassword")
									})]
								}), errors.confirmPassword && /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.confirmPassword]
								})] })
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "mt-auto md:mt-10 pt-8 md:pt-4 space-y-4",
							children: [/* @__PURE__ */ jsx("button", {
								disabled: loading,
								type: "submit",
								className: "w-full cursor-pointer rounded-full bg-cyan text-white font-bold py-4 text-lg active:scale-[0.98] transition disabled:opacity-50",
								children: loading ? "MENDAFTAR..." : "REGISTRASI"
							}), /* @__PURE__ */ jsx(Link, {
								to: "/",
								className: "block text-center text-lg font-bold text-nest-foreground hover:opacity-80 transition",
								children: "LOGIN"
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ jsx("div", { className: "hidden md:block h-16 scallop-top bg-nest-foreground shrink-0" })
		]
	});
}
//#endregion
export { Register as component };
