import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./db.server";

export const likePostFn = createServerFn({ method: "POST" })
  .validator((data: { postId: string; userId: string; action: "like" | "unlike" }) => data)
  .handler(async ({ data }) => {
    if (data.action === "like") {
      const like = await prisma.like.create({
        data: { postId: data.postId, userId: data.userId },
        include: { post: true }
      });
      // Create notification
      if (like.post.userId !== data.userId) {
        await prisma.notification.create({
          data: {
            userId: like.post.userId,
            actorId: data.userId,
            type: "LIKE",
            entityId: data.postId,
          }
        });
      }
      return like;
    } else {
      await prisma.like.deleteMany({
        where: { postId: data.postId, userId: data.userId }
      });
      return { success: true };
    }
  });

export const favoritePostFn = createServerFn({ method: "POST" })
  .validator((data: { postId: string; userId: string; action: "favorite" | "unfavorite" }) => data)
  .handler(async ({ data }) => {
    if (data.action === "favorite") {
      return await prisma.favorite.create({
        data: { postId: data.postId, userId: data.userId }
      });
    } else {
      await prisma.favorite.deleteMany({
        where: { postId: data.postId, userId: data.userId }
      });
      return { success: true };
    }
  });

export const commentPostFn = createServerFn({ method: "POST" })
  .validator((data: { postId: string; userId: string; text: string }) => data)
  .handler(async ({ data }) => {
    const comment = await prisma.comment.create({
      data: { postId: data.postId, userId: data.userId, text: data.text },
      include: { post: true, user: true }
    });

    if (comment.post.userId !== data.userId) {
      await prisma.notification.create({
        data: {
          userId: comment.post.userId,
          actorId: data.userId,
          type: "COMMENT",
          entityId: data.postId,
        }
      });
    }
    return comment;
  });

export const getCommentsFn = createServerFn({ method: "POST" })
  .validator((postId: string) => postId)
  .handler(async ({ data }) => {
    return await prisma.comment.findMany({
      where: { postId: data },
      orderBy: { createdAt: "asc" },
      include: { user: true },
    });
  });

export const getNotificationsFn = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data }) => {
    return await prisma.notification.findMany({
      where: { userId: data },
      orderBy: { createdAt: "desc" },
      include: { actor: true },
    });
  });

export const markAllNotificationsReadFn = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data }) => {
    await prisma.notification.updateMany({
      where: { userId: data, read: false },
      data: { read: true },
    });
    return { success: true };
  });

export const markNotificationReadFn = createServerFn({ method: "POST" })
  .validator((notificationId: string) => notificationId)
  .handler(async ({ data }) => {
    await prisma.notification.update({
      where: { id: data },
      data: { read: true },
    });
    return { success: true };
  });

export const deleteNotificationFn = createServerFn({ method: "POST" })
  .validator((data: { notificationId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    await prisma.notification.deleteMany({
      where: { id: data.notificationId, userId: data.userId },
    });
    return { success: true };
  });

export const deleteCommentFn = createServerFn({ method: "POST" })
  .validator((data: { commentId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const comment = await prisma.comment.findUnique({ where: { id: data.commentId } });
    if (!comment || comment.userId !== data.userId) {
      throw new Error("Unauthorized to delete this comment");
    }

    await prisma.comment.delete({
      where: { id: data.commentId },
    });
    return { success: true };
  });

export const toggleFollowFn = createServerFn({ method: "POST" })
  .validator((data: { followerId: string; followingId: string; action: "follow" | "unfollow" }) => data)
  .handler(async ({ data }) => {
    if (data.action === "follow") {
      const follow = await prisma.follow.create({
        data: { followerId: data.followerId, followingId: data.followingId }
      });
      // Create notification
      await prisma.notification.create({
        data: {
          userId: data.followingId,
          actorId: data.followerId,
          type: "FOLLOW",
        }
      });
      return follow;
    } else {
      await prisma.follow.deleteMany({
        where: { followerId: data.followerId, followingId: data.followingId }
      });
      return { success: true };
    }
  });
