import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./db.server";

export const getMessagesFn = createServerFn({ method: "POST" })
  .validator((data: { userId: string; contactUsername: string }) => data)
  .handler(async ({ data }) => {
    // Find contact user ID first
    const contact = await prisma.user.findUnique({
      where: { username: data.contactUsername },
    });
    if (!contact) throw new Error("User not found");

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: data.userId, receiverId: contact.id },
          { senderId: contact.id, receiverId: data.userId },
        ],
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return { messages, contactId: contact.id };
  });

export const sendMessageFn = createServerFn({ method: "POST" })
  .validator((data: { senderId: string; receiverId: string; text: string }) => data)
  .handler(async ({ data }) => {
    const message = await prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
      },
      include: {
        sender: true,
      }
    });

    return message;
  });
