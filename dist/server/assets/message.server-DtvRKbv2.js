import { i as createServerFn } from "./esm-Dova13aH.js";
import { n as createServerRpc, t as prisma } from "./db.server-D5jV7CVq.js";
//#region src/lib/message.server.ts?tss-serverfn-split
var getConversationsFn_createServerFn_handler = createServerRpc({
	id: "83f156a1ca0c8aefb6213c7ca10d9dfd85e83dc341dbbdfd2704462469ed2860",
	name: "getConversationsFn",
	filename: "src/lib/message.server.ts"
}, (opts) => getConversationsFn.__executeServer(opts));
var getConversationsFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(getConversationsFn_createServerFn_handler, async ({ data: userId }) => {
	const messages = await prisma.message.findMany({
		where: { OR: [{ senderId: userId }, { receiverId: userId }] },
		orderBy: { createdAt: "desc" },
		include: {
			sender: { select: {
				id: true,
				username: true,
				displayName: true,
				avatar: true
			} },
			receiver: { select: {
				id: true,
				username: true,
				displayName: true,
				avatar: true
			} }
		}
	});
	const conversationsMap = /* @__PURE__ */ new Map();
	messages.forEach((msg) => {
		const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
		const partner = msg.senderId === userId ? msg.receiver : msg.sender;
		if (!conversationsMap.has(partnerId)) conversationsMap.set(partnerId, {
			id: partnerId,
			user: partner.displayName || partner.username,
			username: partner.username,
			avatar: partner.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${partner.username}`,
			latestMessage: msg,
			unreadCount: 0
		});
		if (msg.receiverId === userId && !msg.read) conversationsMap.get(partnerId).unreadCount += 1;
	});
	return Array.from(conversationsMap.values());
});
var getMessagesFn_createServerFn_handler = createServerRpc({
	id: "0726cf6375655a2d1a9552bc3e48126d9bcce6b79353c4a2db132644f45a084d",
	name: "getMessagesFn",
	filename: "src/lib/message.server.ts"
}, (opts) => getMessagesFn.__executeServer(opts));
var getMessagesFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getMessagesFn_createServerFn_handler, async ({ data: { userId, partnerId } }) => {
	return await prisma.message.findMany({
		where: { OR: [{
			senderId: userId,
			receiverId: partnerId
		}, {
			senderId: partnerId,
			receiverId: userId
		}] },
		orderBy: { createdAt: "asc" }
	});
});
var sendMessageFn_createServerFn_handler = createServerRpc({
	id: "55a426cd295dc1d2dd9701272d122f5bd79d998107bb257d92bb1fb65c4f8d96",
	name: "sendMessageFn",
	filename: "src/lib/message.server.ts"
}, (opts) => sendMessageFn.__executeServer(opts));
var sendMessageFn = createServerFn({ method: "POST" }).validator((data) => data).handler(sendMessageFn_createServerFn_handler, async ({ data }) => {
	return await prisma.message.create({ data: {
		senderId: data.senderId,
		receiverId: data.receiverId,
		text: data.text
	} });
});
var withdrawMessageFn_createServerFn_handler = createServerRpc({
	id: "f8e9971b340ca89ee616d62c1fa880ccff87aa04b7eb10f239d758262a6146c3",
	name: "withdrawMessageFn",
	filename: "src/lib/message.server.ts"
}, (opts) => withdrawMessageFn.__executeServer(opts));
var withdrawMessageFn = createServerFn({ method: "POST" }).validator((data) => data).handler(withdrawMessageFn_createServerFn_handler, async ({ data }) => {
	const msg = await prisma.message.findUnique({ where: { id: data.messageId } });
	if (!msg || msg.senderId !== data.currentUserId) throw new Error("Unauthorized to withdraw this message");
	return await prisma.message.update({
		where: { id: data.messageId },
		data: { withdrawn: true }
	});
});
var markMessagesAsReadFn_createServerFn_handler = createServerRpc({
	id: "27db5257b94479ef610a5558aea0e041c90aa31d580f836ac263fce0a273887b",
	name: "markMessagesAsReadFn",
	filename: "src/lib/message.server.ts"
}, (opts) => markMessagesAsReadFn.__executeServer(opts));
var markMessagesAsReadFn = createServerFn({ method: "POST" }).validator((data) => data).handler(markMessagesAsReadFn_createServerFn_handler, async ({ data }) => {
	await prisma.message.updateMany({
		where: {
			receiverId: data.currentUserId,
			senderId: data.senderId,
			read: false
		},
		data: { read: true }
	});
	return { success: true };
});
var getUnreadMessagesCountFn_createServerFn_handler = createServerRpc({
	id: "e62509829b2aebfa515062edec3dc7e4ce84371f2a8ca9d409231978ffb33b15",
	name: "getUnreadMessagesCountFn",
	filename: "src/lib/message.server.ts"
}, (opts) => getUnreadMessagesCountFn.__executeServer(opts));
var getUnreadMessagesCountFn = createServerFn({ method: "POST" }).validator((userId) => userId).handler(getUnreadMessagesCountFn_createServerFn_handler, async ({ data: userId }) => {
	return await prisma.message.count({ where: {
		receiverId: userId,
		read: false
	} });
});
//#endregion
export { getConversationsFn_createServerFn_handler, getMessagesFn_createServerFn_handler, getUnreadMessagesCountFn_createServerFn_handler, markMessagesAsReadFn_createServerFn_handler, sendMessageFn_createServerFn_handler, withdrawMessageFn_createServerFn_handler };
