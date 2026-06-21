import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-DsUV4Div.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./AuthContext-DiFfoXlB.mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Logo } from "./Logo-4c3S_ikB.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-QgS-Ovie.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SplashLogin() {
	const [showLogin, setShowLogin] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [errorMsg, setErrorMsg] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const { user, loading: authLoading } = useAuth();
	(0, import_react.useEffect)(() => {
		if (!authLoading && user) navigate({ to: "/home" });
	}, [
		user,
		authLoading,
		navigate
	]);
	const handleLogin = async (e) => {
		e.preventDefault();
		setErrorMsg("");
		try {
			setLoading(true);
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			if (error) throw error;
			toast.success("Logged in successfully! Welcome back! 🎉");
			navigate({ to: "/home" });
		} catch (err) {
			const msg = err.message?.includes("Invalid login credentials") ? "Incorrect email or password." : err.message || "Failed to log in, please try again.";
			setErrorMsg(msg);
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setShowLogin(true), 1800);
		return () => clearTimeout(t);
	}, []);
	if (authLoading || user) return null;
	if (!showLogin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-nest flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 scallop-bottom bg-black/15" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 flex flex-col px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { size: "xl" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pb-12 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-cream/90 font-medium tracking-wide text-center",
						children: [
							"A Safe Place to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-cyan",
								children: "Breathe"
							}),
							", Share, and ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-cyan",
								children: "Heal"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 scallop-top bg-black/15" })
		]
	});
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
						onSubmit: handleLogin,
						className: "w-full max-w-sm mx-auto flex flex-col flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
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
											setErrorMsg("");
										},
										placeholder: "example@gmail.com",
										className: `mt-1 w-full bg-transparent border-b px-0 py-2 text-base outline-none transition text-foreground placeholder:text-muted-foreground ${errorMsg ? "border-red-500 focus:border-red-500" : "border-nest-foreground focus:border-cyan"}`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl font-bold text-nest-foreground",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										value: password,
										onChange: (e) => {
											setPassword(e.target.value);
											setErrorMsg("");
										},
										placeholder: "Your password",
										className: `mt-1 w-full bg-transparent border-b px-0 py-2 text-base outline-none transition text-foreground placeholder:text-muted-foreground ${errorMsg ? "border-red-500 focus:border-red-500" : "border-nest-foreground focus:border-cyan"}`
									})]
								}),
								errorMsg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-red-500 font-medium -mt-4 animate-in fade-in slide-in-from-top-1",
									children: ["⚠ ", errorMsg]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-auto md:mt-12 pt-16 md:pt-4 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: loading,
								type: "submit",
								className: "w-full cursor-pointer rounded-full bg-cyan text-white font-bold py-4 text-lg active:scale-[0.98] transition disabled:opacity-50",
								children: loading ? "LOGGING IN..." : "LOGIN"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "block text-center text-lg font-bold text-nest-foreground hover:opacity-80 transition",
								children: "REGISTER"
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
export { SplashLogin as component };
