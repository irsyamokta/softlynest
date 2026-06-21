import { t as supabase } from "./supabase-DsUV4Div.js";
import { n as useAuth } from "./AuthContext-DiFfoXlB.js";
import { c as getUserPostsFn } from "./post.server-S-YufaV0.js";
import { u as toggleFollowFn } from "./interaction.server-CAIDaUKj.js";
import { t as PostCard } from "./PostCard-BL15sQaD.js";
import { t as EmptyState } from "./EmptyState-CzJlrCAg.js";
import { a as getProfileByUsernameFn, i as getMyProfileFn, r as getFollowListFn } from "./auth.server-C3pOWsG0.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ghost, UserCheck, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
//#region src/components/softly/FollowListModal.tsx
function UserRow({ u, currentUserId, onClose }) {
	const [following, setFollowing] = useState(u.isFollowing);
	const isMe = u.id === currentUserId;
	const avatarUrl = u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;
	const handleToggle = async () => {
		if (isMe) return;
		const next = !following;
		setFollowing(next);
		try {
			await toggleFollowFn({ data: {
				followerId: currentUserId,
				followingId: u.id,
				action: next ? "follow" : "unfollow"
			} });
		} catch {
			toast.error("Failed to update follow");
			setFollowing(!next);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3 py-3 px-1 border-b border-border/30 last:border-0",
		children: [
			/* @__PURE__ */ jsx(Link, {
				to: "/user/$username",
				params: { username: u.username },
				onClick: onClose,
				className: "shrink-0",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-pink/60 to-yellow/60",
					children: /* @__PURE__ */ jsx("img", {
						src: avatarUrl,
						alt: u.username,
						className: "w-full h-full object-cover"
					})
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/user/$username",
					params: { username: u.username },
					onClick: onClose,
					className: "font-bold text-sm text-black hover:underline truncate block",
					children: ["@", u.username]
				}), u.bio && /* @__PURE__ */ jsx("p", {
					className: "text-xs text-muted-foreground truncate",
					children: u.bio
				})]
			}),
			!isMe && /* @__PURE__ */ jsxs("button", {
				onClick: handleToggle,
				className: `shrink-0 flex items-center gap-1.5 rounded-full font-bold text-xs px-4 py-2 transition cursor-pointer ${following ? "bg-nest-foreground/10 text-nest-foreground hover:bg-nest-foreground/20" : "bg-cyan text-white hover:bg-cyan/90"}`,
				children: [following && /* @__PURE__ */ jsx(UserCheck, { className: "w-3.5 h-3.5" }), following ? "Following" : "Follow"]
			})
		]
	});
}
function FollowListModal({ profileUserId, type, count, onClose }) {
	const { user } = useAuth();
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [tab, setTab] = useState(type);
	useEffect(() => {
		setLoading(true);
		getFollowListFn({ data: {
			profileUserId,
			type: tab,
			currentUserId: user?.id
		} }).then((list) => {
			setUsers(list);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, [
		tab,
		profileUserId,
		user?.id
	]);
	const handleBackdrop = (e) => {
		if (e.target === e.currentTarget) onClose();
	};
	useEffect(() => {
		const handler = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm",
		onClick: handleBackdrop,
		children: /* @__PURE__ */ jsxs("div", {
			className: "relative w-full max-w-md bg-cream rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0 fade-in duration-200",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/30",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex gap-1 bg-nest-foreground/10 p-1 rounded-full",
						children: [/* @__PURE__ */ jsx("button", {
							onClick: () => setTab("followers"),
							className: `px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${tab === "followers" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"}`,
							children: "Followers"
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setTab("following"),
							className: `px-4 py-1.5 rounded-full text-sm font-bold transition cursor-pointer ${tab === "following" ? "bg-white text-black shadow-sm" : "text-muted-foreground hover:text-black"}`,
							children: "Following"
						})]
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/10 transition cursor-pointer",
						"aria-label": "Close",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5 text-black" })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "overflow-y-auto max-h-[60vh] px-5 py-2",
					children: loading ? /* @__PURE__ */ jsx("div", {
						className: "py-10 text-center text-sm text-muted-foreground",
						children: "Loading..."
					}) : users.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "py-10 text-center",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-sm font-bold text-black mb-1",
							children: tab === "followers" ? "No followers yet" : "Not following anyone"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: tab === "followers" ? "When someone follows this account, they'll show up here." : "When this account follows someone, they'll show up here."
						})]
					}) : users.map((u) => /* @__PURE__ */ jsx(UserRow, {
						u,
						currentUserId: user?.id ?? "",
						onClose
					}, u.id))
				}),
				/* @__PURE__ */ jsx("div", { className: "h-4" })
			]
		})
	});
}
//#endregion
//#region src/components/softly/ProfileContent.tsx
function ProfileContent({ username }) {
	const { user } = useAuth();
	useNavigate();
	const currentUsername = user?.user_metadata?.username;
	const isOwnProfile = !username || username === currentUsername;
	const targetUsername = isOwnProfile ? currentUsername : username;
	const [following, setFollowing] = useState(false);
	const [followModal, setFollowModal] = useState(null);
	const { data: dbProfile } = useQuery({
		queryKey: [
			"profile",
			isOwnProfile ? "me" : username,
			user?.id
		],
		queryFn: async () => {
			if (isOwnProfile && user?.id) return getMyProfileFn({ data: user.id });
			else if (username) return getProfileByUsernameFn({ data: {
				username,
				currentUserId: user?.id
			} });
			return null;
		},
		enabled: isOwnProfile ? !!user?.id : !!username
	});
	const { data: userPosts = [] } = useQuery({
		queryKey: [
			"user-posts",
			isOwnProfile ? user?.id : username,
			user?.id
		],
		queryFn: async () => {
			return getUserPostsFn({ data: {
				targetUserId: isOwnProfile ? user?.id : void 0,
				targetUsername: isOwnProfile ? void 0 : username,
				currentUserId: user?.id
			} });
		},
		enabled: isOwnProfile ? !!user?.id : !!username
	});
	const displayUsername = dbProfile?.username || targetUsername || "user";
	const avatarUrl = dbProfile?.avatar || (isOwnProfile ? user?.user_metadata?.avatar_url : null) || `https://api.dicebear.com/9.x/thumbs/svg?seed=${displayUsername}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;
	const avatarEl = /* @__PURE__ */ jsx("div", {
		className: `w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-cream soft-shadow shrink-0 ${!dbProfile?.avatar ? "bg-gradient-to-br from-pink to-yellow" : ""}`,
		children: /* @__PURE__ */ jsx("img", {
			src: avatarUrl,
			alt: displayUsername,
			className: "w-full h-full object-cover"
		})
	});
	const displayName = `@${displayUsername}`;
	const bio = dbProfile?.bio || (isOwnProfile ? user?.user_metadata?.bio : "") || "";
	const postCount = dbProfile?._count?.posts ?? userPosts.length;
	const initialFollowerCount = dbProfile?._count?.followers ?? 0;
	const initialFollowingCount = dbProfile?._count?.following ?? 0;
	const [followerCount, setFollowerCount] = useState(initialFollowerCount);
	const [followingCount, setFollowingCount] = useState(initialFollowingCount);
	const [isFollowingMe, setIsFollowingMe] = useState(false);
	useEffect(() => {
		if (dbProfile) {
			setFollowerCount(dbProfile._count?.followers ?? 0);
			setFollowingCount(dbProfile._count?.following ?? 0);
			if (dbProfile.isFollowing !== void 0) setFollowing(dbProfile.isFollowing);
			if (dbProfile.isFollowingMe !== void 0) setIsFollowingMe(dbProfile.isFollowingMe);
		}
	}, [dbProfile]);
	useEffect(() => {
		if (!dbProfile?.id) return;
		const channel = supabase.channel(`follows-${dbProfile.id}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "Follow",
			filter: `"followingId"=eq.${dbProfile.id}`
		}, () => {
			setFollowerCount((c) => c + 1);
		}).on("postgres_changes", {
			event: "DELETE",
			schema: "public",
			table: "Follow",
			filter: `"followingId"=eq.${dbProfile.id}`
		}, () => {
			setFollowerCount((c) => Math.max(0, c - 1));
		}).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "Follow",
			filter: `"followerId"=eq.${dbProfile.id}`
		}, () => {
			setFollowingCount((c) => c + 1);
		}).on("postgres_changes", {
			event: "DELETE",
			schema: "public",
			table: "Follow",
			filter: `"followerId"=eq.${dbProfile.id}`
		}, () => {
			setFollowingCount((c) => Math.max(0, c - 1));
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [dbProfile?.id]);
	const handleFollow = async () => {
		if (!user) {
			toast.error("Please login to follow");
			return;
		}
		if (!dbProfile?.id) return;
		const isFollowing = !following;
		setFollowing(isFollowing);
		setFollowerCount((c) => isFollowing ? c + 1 : Math.max(0, c - 1));
		try {
			await toggleFollowFn({ data: {
				followerId: user.id,
				followingId: dbProfile.id,
				action: isFollowing ? "follow" : "unfollow"
			} });
		} catch (err) {
			toast.error(err.message || "Failed to follow");
			setFollowing(!isFollowing);
			setFollowerCount((c) => isFollowing ? c - 1 : c + 1);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "px-4 py-4 md:px-0 md:py-0",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "hidden md:block text-2xl font-extrabold mb-4",
				children: "Profile"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pb-4 flex items-center gap-4",
				children: [avatarEl, /* @__PURE__ */ jsxs("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "font-extrabold text-lg md:text-2xl truncate text-black",
							children: displayName
						}),
						bio && /* @__PURE__ */ jsx("p", {
							className: "text-xs md:text-sm text-gray-800 mt-0.5",
							children: bio
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-4 mt-2 text-xs md:text-sm text-black",
							children: [
								/* @__PURE__ */ jsxs("span", { children: [
									/* @__PURE__ */ jsx("b", { children: postCount }),
									" ",
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground",
										children: "posts"
									})
								] }),
								/* @__PURE__ */ jsxs("button", {
									onClick: () => setFollowModal("followers"),
									className: "cursor-pointer hover:underline text-left",
									children: [
										/* @__PURE__ */ jsx("b", { children: followerCount }),
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: "followers"
										})
									]
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: () => setFollowModal("following"),
									className: "cursor-pointer hover:underline text-left",
									children: [
										/* @__PURE__ */ jsx("b", { children: followingCount }),
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground",
											children: "following"
										})
									]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "mb-6 flex gap-3",
				children: isOwnProfile ? /* @__PURE__ */ jsx(Link, {
					to: "/settings",
					className: "flex-1 md:flex-none md:w-auto md:px-8 rounded-full bg-nest-foreground/10 text-nest-foreground font-bold py-2.5 text-sm hover:bg-nest-foreground/20 transition cursor-pointer text-center block",
					children: "Edit profile"
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
					onClick: handleFollow,
					className: `flex-1 md:flex-none md:px-8 flex items-center justify-center gap-2 rounded-full font-bold py-2.5 text-sm transition cursor-pointer ${following ? "bg-nest-foreground/10 text-nest-foreground hover:bg-nest-foreground/20" : isFollowingMe ? "bg-pink text-white hover:bg-pink/90" : "bg-cyan text-primary-foreground hover:bg-cyan/90"}`,
					children: [following && /* @__PURE__ */ jsx(UserCheck, { className: "w-4 h-4" }), following ? "Following" : isFollowingMe ? "Follow Back" : "Follow"]
				}), /* @__PURE__ */ jsx(Link, {
					to: "/messages/$messageId",
					params: { messageId: dbProfile?.username || "" },
					className: "flex-1 md:flex-none md:px-8 rounded-full bg-nest-foreground/10 text-nest-foreground font-bold py-2.5 text-sm hover:bg-nest-foreground/20 transition cursor-pointer text-center block",
					children: "Message"
				})] })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pb-8",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 border-b border-border/40 pb-2",
					children: "Posts"
				}), userPosts.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "mt-4",
					children: /* @__PURE__ */ jsx(EmptyState, {
						icon: Ghost,
						title: "No posts yet",
						description: "This space is empty. When posts are created, they'll show up here."
					})
				}) : /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: userPosts.map((p) => {
						return /* @__PURE__ */ jsx(PostCard, { post: {
							id: p.id,
							user: p.user.username,
							avatar: p.user.avatar || "",
							time: formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }),
							text: p.text,
							image: p.image || void 0,
							video: p.video || void 0,
							anonymous: p.anonymous,
							_count: p._count,
							hasLiked: p.hasLiked,
							hasFavorited: p.hasFavorited
						} }, p.id);
					})
				})]
			}),
			followModal && dbProfile?.id && /* @__PURE__ */ jsx(FollowListModal, {
				profileUserId: dbProfile.id,
				type: followModal,
				count: followModal === "followers" ? followerCount : followingCount,
				onClose: () => setFollowModal(null)
			})
		]
	});
}
//#endregion
export { ProfileContent as t };
