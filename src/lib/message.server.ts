import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./db.server";

// Fetch list of conversations for a user
export const getConversationsFn = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    // Get all messages where user is sender or receiver
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, username: true, displayName: true, avatar: true } },
        receiver: { select: { id: true, username: true, displayName: true, avatar: true } },
      },
    });

    // Group by conversation partner
    const conversationsMap = new Map<string, any>();

    messages.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          id: partnerId,
          user: partner.displayName || partner.username,
          username: partner.username,
          avatar: partner.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${partner.username}`,
          latestMessage: msg,
          unreadCount: 0,
        });
      }

      // Count unread messages (where current user is receiver and read is false)
      if (msg.receiverId === userId && !msg.read) {
        conversationsMap.get(partnerId).unreadCount += 1;
      }
    });

    return Array.from(conversationsMap.values());
  });

// Fetch messages between two users
export const getMessagesFn = createServerFn({ method: "POST" })
  .validator((data: { userId: string; partnerId: string }) => data)
  .handler(async ({ data: { userId, partnerId } }) => {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  });

// Send a new message
export const sendMessageFn = createServerFn({ method: "POST" })
  .validator((data: { senderId: string; receiverId: string; text: string }) => data)
  .handler(async ({ data }) => {
    return await prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
      },
    });
  });

// Withdraw a message
export const withdrawMessageFn = createServerFn({ method: "POST" })
  .validator((data: { messageId: string; currentUserId: string }) => data)
  .handler(async ({ data }) => {
    const msg = await prisma.message.findUnique({ where: { id: data.messageId } });
    if (!msg || msg.senderId !== data.currentUserId) {
      throw new Error("Unauthorized to withdraw this message");
    }
    return await prisma.message.update({
      where: { id: data.messageId },
      data: { withdrawn: true },
    });
  });

// Mark all messages from a specific sender as read
export const markMessagesAsReadFn = createServerFn({ method: "POST" })
  .validator((data: { currentUserId: string; senderId: string }) => data)
  .handler(async ({ data }) => {
    await prisma.message.updateMany({
      where: {
        receiverId: data.currentUserId,
        senderId: data.senderId,
        read: false,
      },
      data: { read: true },
    });
    return { success: true };
  });

// Get total unread messages count for a user
export const getUnreadMessagesCountFn = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    return await prisma.message.count({
      where: {
        receiverId: userId,
        read: false,
      },
    });
  });

// Delete all messages between two users
export const deleteConversationFn = createServerFn({ method: "POST" })
  .validator((data: { userId: string; partnerId: string }) => data)
  .handler(async ({ data: { userId, partnerId } }) => {
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
    });
    return { success: true };
  });
