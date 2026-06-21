import { o as __toESM } from "./_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "./_libs/react+tanstack__react-query.mjs";
import { n as useAuth } from "./_ssr/AuthContext-DiFfoXlB.mjs";
import { _ as Link, y as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as getProfileByUsernameFn } from "./_ssr/auth.server-C3Vi-jrc.mjs";
import { a as sendMessageFn, i as markMessagesAsReadFn, n as getMessagesFn } from "./_ssr/message.server-ByuRQYLo.mjs";
import { t as playMessageSound } from "./_ssr/sounds-DDZlDPLE.mjs";
import { E as ArrowLeft, l as Send } from "./_libs/lucide-react.mjs";
import { t as EmojiPicker } from "./_ssr/EmojiPicker-CJFW-xdf.mjs";
import { t as Route } from "./_shell.messages._messageId-BsjkKCa6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_shell.messages._messageId-B5ln94C7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MY_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop";
function ChatRoom() {
	const { messageId } = Route.useParams();
	const navigate = useNavigate();
	const { user } = useAuth();
	const { data: targetProfile, isLoading } = useQuery({
		queryKey: ["profile", messageId],
		queryFn: () => getProfileByUsernameFn({ data: { username: messageId } })
	});
	const conversation = targetProfile ? {
		user: targetProfile.displayName || targetProfile.username,
		avatar: targetProfile.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${targetProfile.username}`
	} : null;
	const { data: dbMessages = [], refetch: refetchMessages } = useQuery({
		queryKey: [
			"messages",
			user?.id,
			targetProfile?.id
		],
		queryFn: () => getMessagesFn({ data: {
			userId: user.id,
			partnerId: targetProfile.id
		} }),
		enabled: !!user?.id && !!targetProfile?.id,
		refetchInterval: 3e3
	});
	const queryClient = useQueryClient();
	(0, import_react.useEffect)(() => {
		if (user?.id && targetProfile?.id) markMessagesAsReadFn({ data: {
			currentUserId: user.id,
			senderId: targetProfile.id
		} }).then(() => {
			queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		});
	}, [
		user?.id,
		targetProfile?.id,
		dbMessages.length
	]);
	const [input, setInput] = (0, import_react.useState)("");
	const bottomRef = (0, import_react.useRef)(null);
	const textareaRef = (0, import_react.useRef)(null);
	const msgListRef = (0, import_react.useRef)(null);
	const prevMessageCountRef = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		const prevCount = prevMessageCountRef.current;
		const newCount = dbMessages.length;
		if (prevCount > 0 && newCount > prevCount) {
			const newest = dbMessages[dbMessages.length - 1];
			if (newest && newest.senderId !== user?.id) playMessageSound();
		}
		prevMessageCountRef.current = newCount;
	}, [
		dbMessages.length,
		dbMessages,
		user?.id
	]);
	(0, import_react.useEffect)(() => {
		const el = msgListRef.current;
		if (!el) return;
		const check = () => {
			if (el.scrollHeight > el.clientHeight) el.classList.add("can-scroll");
			else el.classList.remove("can-scroll");
		};
		check();
		const ro = new ResizeObserver(check);
		ro.observe(el);
		return () => ro.disconnect();
	}, [dbMessages]);
	const { data: presenceState } = useQuery({
		queryKey: ["global-presence"],
		queryFn: () => queryClient.getQueryData(["global-presence"]) || {},
		enabled: !!targetProfile?.id
	});
	const isOnline = presenceState ? Object.keys(presenceState).includes(targetProfile?.id || "") : false;
	(0, import_react.useEffect)(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 160) + "px";
	}, [input]);
	const insertEmoji = (emoji) => {
		const el = textareaRef.current;
		if (!el) {
			setInput((v) => v + emoji);
			return;
		}
		const start = el.selectionStart ?? input.length;
		const end = el.selectionEnd ?? input.length;
		setInput(input.slice(0, start) + emoji + input.slice(end));
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(start + emoji.length, start + emoji.length);
		});
	};
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [dbMessages]);
	(0, import_react.useEffect)(() => {
		const handleGlobalKeyDown = (e) => {
			if (e.key === "Escape") navigate({ to: "/messages" });
		};
		document.addEventListener("keydown", handleGlobalKeyDown);
		return () => document.removeEventListener("keydown", handleGlobalKeyDown);
	}, [navigate]);
	const sendMessageMutation = useMutation({
		mutationFn: sendMessageFn,
		onSuccess: () => {
			refetchMessages();
			queryClient.invalidateQueries({ queryKey: ["conversations"] });
		}
	});
	const sendMessage = () => {
		const text = input.trim();
		if (!text || !user?.id || !targetProfile?.id) return;
		sendMessageMutation.mutate({ data: {
			senderId: user.id,
			receiverId: targetProfile.id,
			text
		} });
		setInput("");
		if (textareaRef.current) textareaRef.current.style.height = "auto";
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col items-center justify-center min-h-screen px-4 bg-cream lg:bg-transparent",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "animate-pulse w-8 h-8 rounded-full bg-cyan/20" })
	});
	if (!conversation) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-screen px-4 text-muted-foreground bg-nest",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Conversation not found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/messages",
			className: "mt-4 text-cyan font-bold underline",
			children: "← Back to Messages"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col h-full w-full bg-cream lg:bg-transparent",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur border-b border-border/40 sticky top-0 z-10 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/messages",
						className: "lg:hidden text-nest-foreground hover:text-cyan transition cursor-pointer p-1.5 -ml-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "w-5 h-5",
							strokeWidth: 2.5
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: conversation.avatar,
						alt: conversation.user,
						className: "w-10 h-10 rounded-full object-cover bg-muted shrink-0"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-bold text-sm text-black truncate",
							children: conversation.user
						}), isOnline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-emerald-500 font-semibold transition-opacity duration-300",
							children: "Online"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground transition-opacity duration-300",
							children: "Offline"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: msgListRef,
				className: "flex-1 overflow-y-auto px-4 py-4 space-y-3 chat-scroll",
				children: [dbMessages.map((msg) => {
					const isMe = msg.senderId === user?.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`,
						children: [!isMe ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: conversation.avatar,
							alt: conversation.user,
							className: "w-8 h-8 rounded-full object-cover shrink-0 mb-0.5"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: user?.user_metadata?.avatar_url || MY_AVATAR,
							alt: "me",
							className: "w-8 h-8 rounded-full object-cover shrink-0 mb-0.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `max-w-[72%] flex flex-col ${isMe ? "items-end" : "items-start"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `px-4 py-2.5 rounded-3xl text-sm leading-relaxed ${isMe ? "bg-cyan text-white rounded-br-md" : "bg-white text-black border border-border/40 rounded-bl-md soft-shadow"}`,
								children: msg.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground mt-1 px-1",
								children: [new Date(msg.createdAt).toLocaleTimeString([], {
									hour: "2-digit",
									minute: "2-digit"
								}), isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-1 text-cyan",
									children: msg.read ? "✓✓" : "✓"
								})]
							})]
						})]
					}, msg.id);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white/80 backdrop-blur border-t border-border/40 px-3 py-3 flex items-end gap-2 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmojiPicker, { onEmojiSelect: insertEmoji }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 bg-muted rounded-3xl px-4 py-2.5 flex items-end min-h-[48px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							ref: textareaRef,
							value: input,
							onChange: (e) => setInput(e.target.value),
							onKeyDown: handleKeyDown,
							placeholder: "Say something kind… 💬",
							rows: 1,
							style: {
								height: "auto",
								maxHeight: "160px"
							},
							className: "w-full bg-transparent text-base outline-none resize-none leading-snug text-black placeholder:text-muted-foreground overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: sendMessage,
						disabled: !input.trim(),
						className: `w-12 h-12 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${input.trim() ? "bg-cyan text-white hover:bg-cyan/90 shadow-md" : "bg-muted text-muted-foreground"}`,
						"aria-label": "Send message",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {
							className: "w-5 h-5",
							strokeWidth: 2.5
						})
					})
				]
			})
		]
	});
}
//#endregion
export { ChatRoom as component };
