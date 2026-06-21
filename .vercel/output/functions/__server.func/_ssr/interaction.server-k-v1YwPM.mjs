import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as prisma, t as createServerRpc } from "./db.server-HSC81waZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interaction.server-k-v1YwPM.js
var likePostFn_createServerFn_handler = createServerRpc({
	id: "9711f81d28457d45d362150574431804cbca6102a1e50d3228b2fb096b4c28f7",
	name: "likePostFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => likePostFn.__executeServer(opts));
var likePostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(likePostFn_createServerFn_handler, async ({ data }) => {
	if (data.action === "like") {
		const like = await prisma.like.create({
			data: {
				postId: data.postId,
				userId: data.userId
			},
			include: { post: true }
		});
		if (like.post.userId !== data.userId) await prisma.notification.create({ data: {
			userId: like.post.userId,
			actorId: data.userId,
			type: "LIKE",
			entityId: data.postId
		} });
		return like;
	} else {
		await prisma.like.deleteMany({ where: {
			postId: data.postId,
			userId: data.userId
		} });
		return { success: true };
	}
});
var favoritePostFn_createServerFn_handler = createServerRpc({
	id: "589c7e6813f6d50c190b81108fa54e3444c726f2c1762beb0922de73230b6040",
	name: "favoritePostFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => favoritePostFn.__executeServer(opts));
var favoritePostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(favoritePostFn_createServerFn_handler, async ({ data }) => {
	if (data.action === "favorite") return await prisma.favorite.create({ data: {
		postId: data.postId,
		userId: data.userId
	} });
	else {
		await prisma.favorite.deleteMany({ where: {
			postId: data.postId,
			userId: data.userId
		} });
		return { success: true };
	}
});
var commentPostFn_createServerFn_handler = createServerRpc({
	id: "fa0e0e1dae08acf63c0a591f16aea751ab253c85e728be2461a105a464fc28b1",
	name: "commentPostFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => commentPostFn.__executeServer(opts));
var commentPostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(commentPostFn_createServerFn_handler, async ({ data }) => {
	const comment = await prisma.comment.create({
		data: {
			postId: data.postId,
			userId: data.userId,
			text: data.text
		},
		include: {
			post: true,
			user: true
		}
	});
	if (comment.post.userId !== data.userId) await prisma.notification.create({ data: {
		userId: comment.post.userId,
		actorId: data.userId,
		type: "COMMENT",
		entityId: data.postId
	} });
	return comment;
});
var getCommentsFn_createServerFn_handler = createServerRpc({
	id: "49b920660566bf2892d04ad626af48052cc433ba1147c67059221b093ce93487",
	name: "getCommentsFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => getCommentsFn.__executeServer(opts));
var getCommentsFn = createServerFn({ method: "POST" }).validator((postId) => postId).handler(getCommentsFn_createServerFn_handler, async ({ data }) => {
	return await prisma.comment.findMany({
		where: { postId: data },
		orderBy: { createdAt: "asc" },
		include: { user: true }
	});
});
var getNotificationsFn_createServerFn_handler = createServerRpc({
	id: "a66e672d52c420d38b1121f21dd83303b54bb597c4a112d4c073fe4567d72bd7",
	name: "getNotificationsFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => getNotificationsFn.__executeServer(opts));
var getNotificationsFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(getNotificationsFn_createServerFn_handler, async ({ data }) => {
	return await prisma.notification.findMany({
		where: { userId: data },
		orderBy: { createdAt: "desc" },
		include: { actor: true }
	});
});
var markAllNotificationsReadFn_createServerFn_handler = createServerRpc({
	id: "e48c9ee005cdd3aafc102420d29ed82769b546110c14c3958c097649917f0306",
	name: "markAllNotificationsReadFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => markAllNotificationsReadFn.__executeServer(opts));
var markAllNotificationsReadFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(markAllNotificationsReadFn_createServerFn_handler, async ({ data }) => {
	await prisma.notification.updateMany({
		where: {
			userId: data,
			read: false
		},
		data: { read: true }
	});
	return { success: true };
});
var markNotificationReadFn_createServerFn_handler = createServerRpc({
	id: "db3458b7aafbd1a9a24421cf09d674a57b42be68cf94f2f48d4bb98f52013795",
	name: "markNotificationReadFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => markNotificationReadFn.__executeServer(opts));
var markNotificationReadFn = createServerFn({ method: "POST" }).validator((notificationId) => notificationId).handler(markNotificationReadFn_createServerFn_handler, async ({ data }) => {
	await prisma.notification.update({
		where: { id: data },
		data: { read: true }
	});
	return { success: true };
});
var deleteNotificationFn_createServerFn_handler = createServerRpc({
	id: "2e4bd468a3e6b2b23cee067aea9663b8510cc2a66d1707a52de085cf61179fbf",
	name: "deleteNotificationFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => deleteNotificationFn.__executeServer(opts));
var deleteNotificationFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteNotificationFn_createServerFn_handler, async ({ data }) => {
	await prisma.notification.deleteMany({ where: {
		id: data.notificationId,
		userId: data.userId
	} });
	return { success: true };
});
var deleteCommentFn_createServerFn_handler = createServerRpc({
	id: "0f5c261735d929e2bd41004ff0132f227c4453e47eb60cca37f6be968ba5c6d5",
	name: "deleteCommentFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => deleteCommentFn.__executeServer(opts));
var deleteCommentFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteCommentFn_createServerFn_handler, async ({ data }) => {
	const comment = await prisma.comment.findUnique({ where: { id: data.commentId } });
	if (!comment || comment.userId !== data.userId) throw new Error("Unauthorized to delete this comment");
	await prisma.comment.delete({ where: { id: data.commentId } });
	return { success: true };
});
var toggleFollowFn_createServerFn_handler = createServerRpc({
	id: "f763b515b06f8ee714e636f05adf1579d3c5e97c010cd84347b3f0f8aa1752cd",
	name: "toggleFollowFn",
	filename: "src/lib/interaction.server.ts"
}, (opts) => toggleFollowFn.__executeServer(opts));
var toggleFollowFn = createServerFn({ method: "POST" }).validator((data) => data).handler(toggleFollowFn_createServerFn_handler, async ({ data }) => {
	if (data.action === "follow") {
		const follow = await prisma.follow.create({ data: {
			followerId: data.followerId,
			followingId: data.followingId
		} });
		await prisma.notification.create({ data: {
			userId: data.followingId,
			actorId: data.followerId,
			type: "FOLLOW"
		} });
		return follow;
	} else {
		await prisma.follow.deleteMany({ where: {
			followerId: data.followerId,
			followingId: data.followingId
		} });
		return { success: true };
	}
});
//#endregion
export { commentPostFn_createServerFn_handler, deleteCommentFn_createServerFn_handler, deleteNotificationFn_createServerFn_handler, favoritePostFn_createServerFn_handler, getCommentsFn_createServerFn_handler, getNotificationsFn_createServerFn_handler, likePostFn_createServerFn_handler, markAllNotificationsReadFn_createServerFn_handler, markNotificationReadFn_createServerFn_handler, toggleFollowFn_createServerFn_handler };
