import { o as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/supabase-DsUV4Div.mjs";
import { a as require_jsx_runtime, o as require_react } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { c as updateProfileFn } from "./_ssr/auth.server-BroEg_wp.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as Trash2, f as Save, p as RefreshCw } from "./_libs/lucide-react.mjs";
import { t as ConfirmModal } from "./_ssr/ConfirmModal-B6utst9w.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.settings-CUr-CPC1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsContent() {
	const { user } = useAuth();
	const [email, setEmail] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [avatarUrl, setAvatarUrl] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [deleteModalOpen, setDeleteModalOpen] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) {
			setEmail(user.email || "");
			setUsername(user.user_metadata?.username || "");
			setBio(user.user_metadata?.bio || "");
			setAvatarUrl(user.user_metadata?.avatar_url || `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.user_metadata?.username || "user"}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`);
		}
	}, [user]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!user) return;
		try {
			setLoading(true);
			await updateProfileFn({ data: {
				id: user.id,
				username,
				bio,
				avatar: avatarUrl
			} });
			await supabase.auth.updateUser({ data: {
				username,
				bio,
				avatar_url: avatarUrl
			} });
			if (password) {
				const { error } = await supabase.auth.updateUser({ password });
				if (error) throw error;
			}
			toast.success("Profil berhasil diperbarui! ✨");
		} catch (err) {
			toast.error(err.message || "Gagal memperbarui profil");
		} finally {
			setLoading(false);
		}
	};
	const handleRefreshAvatar = () => {
		setAvatarUrl(`https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.random().toString(36).substring(7)}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "hidden md:block text-2xl font-extrabold",
					children: "Settings"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pb-8 w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3",
						children: "Edit Profile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "bg-white rounded-3xl p-5 md:p-6 soft-shadow border border-border/60 flex flex-col gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "self-center relative group cursor-pointer mb-2",
								onClick: handleRefreshAvatar,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: avatarUrl,
										alt: "Profile",
										className: "w-24 h-24 rounded-full object-cover bg-muted transition group-active:scale-95"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center group-active:scale-95",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-6 h-6 text-white" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute bottom-0 right-0 w-7 h-7 bg-cyan rounded-full border-2 border-white flex items-center justify-center shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
											className: "w-3.5 h-3.5 text-white",
											strokeWidth: 2.5
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[11px] font-extrabold text-muted-foreground uppercase pl-1",
												children: "Email"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "email",
												value: email,
												disabled: true,
												className: "w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black/50 cursor-not-allowed"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground pl-1",
												children: "Email tidak bisa diubah dari sini"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-extrabold text-muted-foreground uppercase pl-1",
											children: "Username"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: username,
											onChange: (e) => setUsername(e.target.value),
											placeholder: "Username Anda",
											className: "w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-extrabold text-muted-foreground uppercase pl-1",
											children: "Bio"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: bio,
											onChange: (e) => setBio(e.target.value),
											rows: 3,
											placeholder: "Ceritakan sedikit tentang dirimu...",
											className: "w-full bg-muted rounded-xl px-4 py-3 text-sm font-semibold outline-none text-black resize-none"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-[11px] font-extrabold text-muted-foreground uppercase pl-1",
											children: "Password Baru"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "password",
											value: password,
											onChange: (e) => setPassword(e.target.value),
											placeholder: "Kosongkan jika tidak ingin mengubah",
											className: "w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-muted-foreground/70"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: loading,
									className: "w-full rounded-xl bg-cyan text-primary-foreground font-bold py-3.5 flex items-center justify-center gap-2 transition hover:bg-cyan/90 cursor-pointer disabled:opacity-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {
										className: "w-4 h-4",
										strokeWidth: 2.5
									}), loading ? "Menyimpan..." : "Simpan Perubahan"]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-extrabold text-red-500 uppercase tracking-wider mb-3 pl-1",
							children: "Danger Zone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setDeleteModalOpen(true),
							className: "w-full rounded-xl border-2 border-red-100 bg-red-50/50 text-red-500 font-bold py-3.5 flex items-center justify-center gap-2 transition hover:bg-red-500 hover:text-white hover:border-red-500 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "w-4 h-4",
								strokeWidth: 2.5
							}), " Hapus Akun"]
						})]
					})
				]
			}),
			deleteModalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmModal, {
				title: "Hapus Akun?",
				description: "Tindakan ini tidak dapat dibatalkan. Semua data Anda akan dihapus secara permanen.",
				confirmText: "Hapus",
				cancelText: "Batal",
				variant: "danger",
				onConfirm: () => {
					alert("Account deleted!");
					setDeleteModalOpen(false);
				},
				onClose: () => setDeleteModalOpen(false)
			})
		]
	});
}
function Settings() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsContent, {})
	});
}
//#endregion
export { Settings as component };
