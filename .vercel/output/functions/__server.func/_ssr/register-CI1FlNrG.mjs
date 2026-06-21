import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-DsUV4Div.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./AuthContext-DiFfoXlB.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as syncUserToPrismaFn, t as checkUsernameFn } from "./auth.server-BroEg_wp.mjs";
import { t as Logo } from "./Logo-4c3S_ikB.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-CI1FlNrG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Register() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const { user, loading: authLoading } = useAuth();
	(0, import_react.useEffect)(() => {
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
		if (username.length < 3) newErrors.username = "Username must be at least 3 characters.";
		if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
		if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			toast.error("Please fix the validation errors.");
			return;
		}
		try {
			setLoading(true);
			const { isTaken } = await checkUsernameFn({ data: username });
			if (isTaken) {
				setErrors({ username: `Username @${username} is already taken.` });
				toast.error(`Username @${username} is already taken!`);
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
				const msg = isEmailTaken ? "Email is already registered. Please log in." : error.message;
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
				toast.success("Account successfully created! 🎉");
				navigate({ to: "/home" });
			} else {
				toast.success("Account created! Please check your email for confirmation, then log in.");
				navigate({ to: "/" });
			}
		} catch (err) {
			console.error("Register error:", err);
			toast.error(err.message || "Failed to register.");
		} finally {
			setLoading(false);
		}
	};
	const inputClass = (field) => `mt-1 w-full bg-transparent border-b px-0 py-2 text-base outline-none transition text-foreground placeholder:text-muted-foreground ${errors[field] ? "border-red-500 focus:border-red-500" : "border-nest-foreground focus:border-cyan"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-nest flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 scallop-bottom bg-nest-foreground shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col md:justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col items-center pt-6 pb-12 md:pt-0 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: "xl" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 md:flex-none bg-white w-full rounded-t-[40px] md:max-w-md md:mx-auto md:rounded-[40px] shadow-sm flex flex-col px-8 pt-12 pb-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRegister,
						className: "w-full max-w-sm mx-auto flex flex-col flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
								}), errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.email]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Username"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
								}), errors.username && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.username]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Create password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										value: password,
										onChange: (e) => {
											setPassword(e.target.value);
											clearError("password");
										},
										placeholder: "Min. 6 characters",
										className: inputClass("password")
									})]
								}), errors.password && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.password]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Confirm password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										value: confirmPassword,
										onChange: (e) => {
											setConfirmPassword(e.target.value);
											clearError("confirmPassword");
										},
										placeholder: "Repeat password",
										className: inputClass("confirmPassword")
									})]
								}), errors.confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errors.confirmPassword]
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto md:mt-10 pt-8 md:pt-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: loading,
								type: "submit",
								className: "w-full cursor-pointer rounded-full bg-cyan text-white font-bold py-4 text-lg active:scale-[0.98] transition disabled:opacity-50",
								children: loading ? "REGISTERING..." : "REGISTER"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								className: "block text-center text-lg font-bold text-nest-foreground hover:opacity-80 transition",
								children: "LOGIN"
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "hidden md:block h-16 scallop-top bg-nest-foreground shrink-0" })
		]
	});
}
//#endregion
export { Register as component };
