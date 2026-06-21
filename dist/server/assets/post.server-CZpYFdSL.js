import { i as createServerFn } from "./esm-Dova13aH.js";
import { n as createServerRpc, t as prisma } from "./db.server-D5jV7CVq.js";
import { v2 } from "cloudinary";
//#region src/lib/cloudinary.server.ts
v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_KEY,
	api_secret: process.env.CLOUDINARY_SECRET
});
var uploadMedia = async (base64OrUrl, folder = "softlynest") => {
	try {
		return await v2.uploader.upload(base64OrUrl, {
			folder,
			resource_type: "auto"
		});
	} catch (error) {
		console.error("Cloudinary upload error:", error);
		throw error;
	}
};
//#endregion
//#region src/lib/post.server.ts?tss-serverfn-split
var extractHashtags = (text) => {
	const matches = text.match(/#[\w]+/g);
	return matches ? matches.map((tag) => tag.substring(1).toLowerCase()) : [];
};
var getFeedFn_createServerFn_handler = createServerRpc({
	id: "9e7eaf989d9b57aac5be3140f267164a8516d30d17910bc8c8eafc9485f22129",
	name: "getFeedFn",
	filename: "src/lib/post.server.ts"
}, (opts) => getFeedFn.__executeServer(opts));
var getFeedFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getFeedFn_createServerFn_handler, async ({ data }) => {
	return (await prisma.post.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			user: true,
			_count: { select: {
				comments: true,
				likes: true,
				favorites: true
			} },
			likes: data.userId ? { where: { userId: data.userId } } : false,
			favorites: data.userId ? { where: { userId: data.userId } } : false
		}
	})).map((post) => ({
		...post,
		hasLiked: post.likes ? post.likes.length > 0 : false,
		hasFavorited: post.favorites ? post.favorites.length > 0 : false
	}));
});
var createPostFn_createServerFn_handler = createServerRpc({
	id: "dc16952635d1d6747da6c74f60044a2212be5fcd7b2cab4a42811c1e77c17de9",
	name: "createPostFn",
	filename: "src/lib/post.server.ts"
}, (opts) => createPostFn.__executeServer(opts));
var createPostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createPostFn_createServerFn_handler, async ({ data }) => {
	let imageUrl = null;
	let videoUrl = null;
	if (data.imageBase64) imageUrl = (await uploadMedia(data.imageBase64, "softlynest/images")).secure_url;
	if (data.videoBase64) videoUrl = (await uploadMedia(data.videoBase64, "softlynest/videos")).secure_url;
	const hashtags = extractHashtags(data.text);
	const post = await prisma.post.create({ data: {
		userId: data.userId,
		text: data.text,
		image: imageUrl,
		video: videoUrl,
		anonymous: data.anonymous ?? false
	} });
	for (const tag of hashtags) {
		const hashtagRecord = await prisma.hashtag.upsert({
			where: { name: tag },
			update: {},
			create: { name: tag }
		});
		await prisma.postHashtag.create({ data: {
			postId: post.id,
			hashtagId: hashtagRecord.id
		} });
	}
	return post;
});
var getHashtagsFn_createServerFn_handler = createServerRpc({
	id: "c1521c6c961f9c49d625848f21aa7281f73a821397059130c33ff7f56cd97558",
	name: "getHashtagsFn",
	filename: "src/lib/post.server.ts"
}, (opts) => getHashtagsFn.__executeServer(opts));
var getHashtagsFn = createServerFn({ method: "GET" }).handler(getHashtagsFn_createServerFn_handler, async () => {
	return await prisma.hashtag.findMany({
		take: 10,
		orderBy: { posts: { _count: "desc" } }
	});
});
var getExploreFeedFn_createServerFn_handler = createServerRpc({
	id: "c7c2ac4b928f079d8088466fd352a33075871835f9edef669ab389084581e650",
	name: "getExploreFeedFn",
	filename: "src/lib/post.server.ts"
}, (opts) => getExploreFeedFn.__executeServer(opts));
var getExploreFeedFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getExploreFeedFn_createServerFn_handler, async ({ data }) => {
	return (await prisma.post.findMany({
		take: 50,
		orderBy: { createdAt: "desc" },
		include: {
			user: true,
			_count: { select: {
				comments: true,
				likes: true,
				favorites: true
			} },
			likes: data.userId ? { where: { userId: data.userId } } : false,
			favorites: data.userId ? { where: { userId: data.userId } } : false
		}
	})).sort(() => .5 - Math.random()).slice(0, 15).map((post) => ({
		...post,
		hasLiked: post.likes ? post.likes.length > 0 : false,
		hasFavorited: post.favorites ? post.favorites.length > 0 : false
	}));
});
var searchPostsFn_createServerFn_handler = createServerRpc({
	id: "3dc0360ccd780d2fa82c5bf100c989a98bbab23999252b684c5a2626270bdd3f",
	name: "searchPostsFn",
	filename: "src/lib/post.server.ts"
}, (opts) => searchPostsFn.__executeServer(opts));
var searchPostsFn = createServerFn({ method: "POST" }).validator((data) => data).handler(searchPostsFn_createServerFn_handler, async ({ data }) => {
	return (await prisma.post.findMany({
		where: { OR: [{ text: {
			contains: data.query,
			mode: "insensitive"
		} }, { hashtags: { some: { hashtag: { name: {
			contains: data.query,
			mode: "insensitive"
		} } } } }] },
		orderBy: { createdAt: "desc" },
		include: {
			user: true,
			_count: { select: {
				comments: true,
				likes: true,
				favorites: true
			} },
			likes: data.userId ? { where: { userId: data.userId } } : false,
			favorites: data.userId ? { where: { userId: data.userId } } : false
		}
	})).map((post) => ({
		...post,
		hasLiked: post.likes ? post.likes.length > 0 : false,
		hasFavorited: post.favorites ? post.favorites.length > 0 : false
	}));
});
var getFavoritesFn_createServerFn_handler = createServerRpc({
	id: "3a0df688679e9e773ecc4bc0ca33e19da53d16cb808975cc8e842799edc9361e",
	name: "getFavoritesFn",
	filename: "src/lib/post.server.ts"
}, (opts) => getFavoritesFn.__executeServer(opts));
var getFavoritesFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(getFavoritesFn_createServerFn_handler, async ({ data }) => {
	return (await prisma.favorite.findMany({
		where: { userId: data },
		orderBy: { createdAt: "desc" },
		include: { post: { include: {
			user: true,
			_count: { select: {
				comments: true,
				likes: true,
				favorites: true
			} },
			likes: { where: { userId: data } },
			favorites: { where: { userId: data } }
		} } }
	})).map((fav) => ({
		...fav.post,
		hasLiked: fav.post.likes ? fav.post.likes.length > 0 : false,
		hasFavorited: fav.post.favorites ? fav.post.favorites.length > 0 : false
	}));
});
var getPostFn_createServerFn_handler = createServerRpc({
	id: "09ad60b3bba6d01ae609ce629888277ad70dac69407936a2399d8fddbbaf8d9f",
	name: "getPostFn",
	filename: "src/lib/post.server.ts"
}, (opts) => getPostFn.__executeServer(opts));
var getPostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getPostFn_createServerFn_handler, async ({ data }) => {
	const post = await prisma.post.findUnique({
		where: { id: data.postId },
		include: {
			user: true,
			_count: { select: {
				comments: true,
				likes: true,
				favorites: true
			} },
			likes: data.userId ? { where: { userId: data.userId } } : false,
			favorites: data.userId ? { where: { userId: data.userId } } : false
		}
	});
	if (!post) return null;
	return {
		...post,
		hasLiked: post.likes ? post.likes.length > 0 : false,
		hasFavorited: post.favorites ? post.favorites.length > 0 : false
	};
});
var getUserPostsFn_createServerFn_handler = createServerRpc({
	id: "c54f2f6aaf2504ea153342332e9b650e1de9d4efca51feead796399669265dcd",
	name: "getUserPostsFn",
	filename: "src/lib/post.server.ts"
}, (opts) => getUserPostsFn.__executeServer(opts));
var getUserPostsFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getUserPostsFn_createServerFn_handler, async ({ data }) => {
	return (await prisma.post.findMany({
		where: data.targetUserId ? { userId: data.targetUserId } : { user: { username: data.targetUsername } },
		orderBy: { createdAt: "desc" },
		include: {
			user: true,
			_count: { select: {
				comments: true,
				likes: true,
				favorites: true
			} },
			likes: data.currentUserId ? { where: { userId: data.currentUserId } } : false,
			favorites: data.currentUserId ? { where: { userId: data.currentUserId } } : false
		}
	})).map((post) => ({
		...post,
		hasLiked: post.likes ? post.likes.length > 0 : false,
		hasFavorited: post.favorites ? post.favorites.length > 0 : false
	}));
});
var deletePostFn_createServerFn_handler = createServerRpc({
	id: "8a1792cb2a129b576864a351631efd5b1e082ca63236dfdde2bab2a257efa07e",
	name: "deletePostFn",
	filename: "src/lib/post.server.ts"
}, (opts) => deletePostFn.__executeServer(opts));
var deletePostFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deletePostFn_createServerFn_handler, async ({ data }) => {
	const post = await prisma.post.findUnique({ where: { id: data.postId } });
	if (!post || post.userId !== data.userId) throw new Error("Unauthorized to delete this post");
	await prisma.post.delete({ where: { id: data.postId } });
	return { success: true };
});
//#endregion
export { createPostFn_createServerFn_handler, deletePostFn_createServerFn_handler, getExploreFeedFn_createServerFn_handler, getFavoritesFn_createServerFn_handler, getFeedFn_createServerFn_handler, getHashtagsFn_createServerFn_handler, getPostFn_createServerFn_handler, getUserPostsFn_createServerFn_handler, searchPostsFn_createServerFn_handler };
