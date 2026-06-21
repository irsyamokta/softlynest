import { i as createServerFn } from "./esm-Dova13aH.js";
import { n as createServerRpc, t as prisma } from "./db.server-D5jV7CVq.js";
//#region src/lib/auth.server.ts?tss-serverfn-split
var checkUsernameFn_createServerFn_handler = createServerRpc({
	id: "b56bf2948e980f5cbc9e6e055d16792b6ad547af246d5853999cb55e9f36af16",
	name: "checkUsernameFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => checkUsernameFn.__executeServer(opts));
var checkUsernameFn = createServerFn({ method: "POST" }).validator((username) => username).handler(checkUsernameFn_createServerFn_handler, async ({ data }) => {
	return { isTaken: !!await prisma.user.findUnique({ where: { username: data } }) };
});
var searchUsersFn_createServerFn_handler = createServerRpc({
	id: "8d6b6ea82add1e843408efeec6f5137c144e16f0bfa026c0aac8a088c3121226",
	name: "searchUsersFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => searchUsersFn.__executeServer(opts));
var searchUsersFn = createServerFn({ method: "POST" }).validator((data) => data).handler(searchUsersFn_createServerFn_handler, async ({ data }) => {
	return (await prisma.user.findMany({
		where: { OR: [{ username: {
			contains: data.query,
			mode: "insensitive"
		} }, { displayName: {
			contains: data.query,
			mode: "insensitive"
		} }] },
		take: 20,
		select: {
			id: true,
			username: true,
			displayName: true,
			avatar: true,
			bio: true,
			followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false
		}
	})).map((u) => ({
		...u,
		isFollowing: u.followers ? u.followers.length > 0 : false
	}));
});
var getMyProfileFn_createServerFn_handler = createServerRpc({
	id: "e56ddbecd396cd218e2c13df014a63dc9ac751a97146a3443ae8f42e6b3e86a2",
	name: "getMyProfileFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => getMyProfileFn.__executeServer(opts));
var getMyProfileFn = createServerFn({ method: "POST" }).validator((id) => id).handler(getMyProfileFn_createServerFn_handler, async ({ data }) => {
	return await prisma.user.findUnique({
		where: { id: data },
		select: {
			id: true,
			username: true,
			displayName: true,
			bio: true,
			avatar: true,
			_count: { select: {
				posts: true,
				followers: true,
				following: true
			} }
		}
	});
});
var syncUserToPrismaFn_createServerFn_handler = createServerRpc({
	id: "a37fd6cda6f1f78d89d9560c28a198c4bfdde021ef8a2523f3f952c8e06a6035",
	name: "syncUserToPrismaFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => syncUserToPrismaFn.__executeServer(opts));
var syncUserToPrismaFn = createServerFn({ method: "POST" }).validator((data) => data).handler(syncUserToPrismaFn_createServerFn_handler, async ({ data }) => {
	return await prisma.user.upsert({
		where: { id: data.id },
		update: {},
		create: {
			id: data.id,
			username: data.username,
			displayName: data.username,
			avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${data.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`,
			bio: "A soft place to land 🌿"
		}
	});
});
var updateProfileFn_createServerFn_handler = createServerRpc({
	id: "468282a84162be15dfb94dc5314dff337da634ea75ae1518ce602a0373fa67af",
	name: "updateProfileFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => updateProfileFn.__executeServer(opts));
var updateProfileFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateProfileFn_createServerFn_handler, async ({ data }) => {
	const { id, ...updateData } = data;
	return await prisma.user.update({
		where: { id },
		data: updateData
	});
});
var getFollowListFn_createServerFn_handler = createServerRpc({
	id: "956ffe0d797397518dc89183efccdb4035e2b614fc4426ba94938d02bc69e6f3",
	name: "getFollowListFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => getFollowListFn.__executeServer(opts));
var getFollowListFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getFollowListFn_createServerFn_handler, async ({ data }) => {
	if (data.type === "followers") return (await prisma.follow.findMany({
		where: { followingId: data.profileUserId },
		include: { follower: { select: {
			id: true,
			username: true,
			displayName: true,
			avatar: true,
			bio: true,
			followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false
		} } },
		orderBy: { createdAt: "desc" }
	})).map((f) => ({
		id: f.follower.id,
		username: f.follower.username,
		displayName: f.follower.displayName,
		avatar: f.follower.avatar,
		bio: f.follower.bio,
		isFollowing: f.follower.followers ? f.follower.followers.length > 0 : false
	}));
	else return (await prisma.follow.findMany({
		where: { followerId: data.profileUserId },
		include: { following: { select: {
			id: true,
			username: true,
			displayName: true,
			avatar: true,
			bio: true,
			followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false
		} } },
		orderBy: { createdAt: "desc" }
	})).map((f) => ({
		id: f.following.id,
		username: f.following.username,
		displayName: f.following.displayName,
		avatar: f.following.avatar,
		bio: f.following.bio,
		isFollowing: f.following.followers ? f.following.followers.length > 0 : false
	}));
});
var getChatContactsFn_createServerFn_handler = createServerRpc({
	id: "c585ebeac3288313540302398667ddef2ca61e07cc280d69cb21c4ee357ea1c8",
	name: "getChatContactsFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => getChatContactsFn.__executeServer(opts));
var getChatContactsFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(getChatContactsFn_createServerFn_handler, async ({ data }) => {
	const following = await prisma.follow.findMany({
		where: { followerId: data },
		include: { following: true }
	});
	const followers = await prisma.follow.findMany({
		where: { followingId: data },
		include: { follower: true }
	});
	const contactMap = /* @__PURE__ */ new Map();
	following.forEach((f) => {
		contactMap.set(f.following.id, f.following);
	});
	followers.forEach((f) => {
		contactMap.set(f.follower.id, f.follower);
	});
	return Array.from(contactMap.values()).map((u) => ({
		id: u.id,
		username: u.username,
		displayName: u.displayName,
		avatar: u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`
	}));
});
var getProfileByUsernameFn_createServerFn_handler = createServerRpc({
	id: "a24376be31bddfd76a8c9c029124ac8f4187ddb0498cce8644c3b617e43c8600",
	name: "getProfileByUsernameFn",
	filename: "src/lib/auth.server.ts"
}, (opts) => getProfileByUsernameFn.__executeServer(opts));
var getProfileByUsernameFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getProfileByUsernameFn_createServerFn_handler, async ({ data }) => {
	const user = await prisma.user.findUnique({
		where: { username: data.username },
		select: {
			id: true,
			username: true,
			displayName: true,
			bio: true,
			avatar: true,
			followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false,
			following: data.currentUserId ? { where: { followingId: data.currentUserId } } : false,
			_count: { select: {
				posts: true,
				followers: true,
				following: true
			} }
		}
	});
	if (!user) return null;
	return {
		...user,
		isFollowing: user.followers ? user.followers.length > 0 : false,
		isFollowingMe: user.following ? user.following.length > 0 : false
	};
});
//#endregion
export { checkUsernameFn_createServerFn_handler, getChatContactsFn_createServerFn_handler, getFollowListFn_createServerFn_handler, getMyProfileFn_createServerFn_handler, getProfileByUsernameFn_createServerFn_handler, searchUsersFn_createServerFn_handler, syncUserToPrismaFn_createServerFn_handler, updateProfileFn_createServerFn_handler };
