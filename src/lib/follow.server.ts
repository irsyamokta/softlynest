import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./db.server";

export const getProfileFn = createServerFn({ method: "POST" })
  .validator((username: string) => username)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { username: data },
      include: {
        _count: {
          select: { followers: true, following: true, posts: true },
        },
        posts: {
          orderBy: { createdAt: "desc" },
          include: {
            user: true,
            _count: { select: { likes: true, comments: true, favorites: true } }
          }
        }
      }
    });
    return user;
  });

export const toggleFollowFn = createServerFn({ method: "POST" })
  .validator((data: { followerId: string; followingId: string; action: "follow" | "unfollow" }) => data)
  .handler(async ({ data }) => {
    if (data.action === "follow") {
      const follow = await prisma.follow.create({
        data: {
          followerId: data.followerId,
          followingId: data.followingId,
        }
      });
      // Notify
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
        where: {
          followerId: data.followerId,
          followingId: data.followingId,
        }
      });
      return { success: true };
    }
  });

export const checkIsFollowingFn = createServerFn({ method: "POST" })
  .validator((data: { followerId: string; followingId: string }) => data)
  .handler(async ({ data }) => {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: data.followerId,
        followingId: data.followingId,
      }
    });
    return !!follow;
  });
