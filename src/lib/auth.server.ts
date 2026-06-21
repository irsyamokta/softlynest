import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./db.server";

export const checkUsernameFn = createServerFn({ method: "POST" })
  .validator((username: string) => username)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { username: data },
    });
    return { isTaken: !!user };
  });

export const searchUsersFn = createServerFn({ method: "POST" })
  .validator((data: { query: string; currentUserId?: string }) => data)
  .handler(async ({ data }) => {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: data.query, mode: "insensitive" } },
          { displayName: { contains: data.query, mode: "insensitive" } },
        ],
      },
      take: 20,
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false,
      },
    });

    return users.map((u) => ({
      ...u,
      isFollowing: u.followers ? u.followers.length > 0 : false,
    }));
  });

export const getMyProfileFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { id: data },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });
    return user;
  });

export const syncUserToPrismaFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; email: string; username: string }) => data)
  .handler(async ({ data }) => {
    // Upsert user in Prisma to ensure it exists
    const user = await prisma.user.upsert({
      where: { id: data.id },
      update: {}, // Do nothing if exists
      create: {
        id: data.id,
        username: data.username,
        displayName: data.username,
        avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${data.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`,
        bio: "A soft place to land 🌿",
      },
    });
    return user;
  });

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; username?: string; bio?: string; avatar?: string }) => data)
  .handler(async ({ data }) => {
    const { id, ...updateData } = data;
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return user;
  });

export const getFollowListFn = createServerFn({ method: "POST" })
  .validator((data: { profileUserId: string; type: "followers" | "following"; currentUserId?: string }) => data)
  .handler(async ({ data }) => {
    if (data.type === "followers") {
      const follows = await prisma.follow.findMany({
        where: { followingId: data.profileUserId },
        include: {
          follower: {
            select: { id: true, username: true, displayName: true, avatar: true, bio: true,
              followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return follows.map((f) => ({
        id: f.follower.id,
        username: f.follower.username,
        displayName: f.follower.displayName,
        avatar: f.follower.avatar,
        bio: f.follower.bio,
        isFollowing: f.follower.followers ? (f.follower.followers as any[]).length > 0 : false,
      }));
    } else {
      const follows = await prisma.follow.findMany({
        where: { followerId: data.profileUserId },
        include: {
          following: {
            select: { id: true, username: true, displayName: true, avatar: true, bio: true,
              followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return follows.map((f) => ({
        id: f.following.id,
        username: f.following.username,
        displayName: f.following.displayName,
        avatar: f.following.avatar,
        bio: f.following.bio,
        isFollowing: f.following.followers ? (f.following.followers as any[]).length > 0 : false,
      }));
    }
  });

export const getChatContactsFn = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data }) => {
    // Get users that current user follows OR users that follow current user
    const following = await prisma.follow.findMany({
      where: { followerId: data },
      include: { following: true }
    });
    
    const followers = await prisma.follow.findMany({
      where: { followingId: data },
      include: { follower: true }
    });

    const contactMap = new Map<string, any>();
    
    following.forEach(f => {
      contactMap.set(f.following.id, f.following);
    });
    
    followers.forEach(f => {
      contactMap.set(f.follower.id, f.follower);
    });

    return Array.from(contactMap.values()).map(u => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatar: u.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${u.username}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`,
    }));
  });

export const getProfileByUsernameFn = createServerFn({ method: "POST" })
  .validator((data: { username: string; currentUserId?: string }) => data)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { username: data.username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        // Does the current user follow this profile?
        followers: data.currentUserId ? { where: { followerId: data.currentUserId } } : false,
        // Does this profile follow the current user?
        following: data.currentUserId ? { where: { followingId: data.currentUserId } } : false,
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      isFollowing: user.followers ? user.followers.length > 0 : false,
      isFollowingMe: user.following ? user.following.length > 0 : false,
    };
  });

export const deleteAccountFn = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    // 1. Fetch all posts with media for Cloudinary cleanup
    const posts = await prisma.post.findMany({
      where: { userId },
      select: { id: true, image: true, video: true },
    });

    // 2. Delete Cloudinary media (non-blocking)
    const { deleteMedia, getPublicIdFromUrl } = await import("./cloudinary.server");
    await Promise.allSettled(
      posts.flatMap((post) => {
        const jobs: Promise<any>[] = [];
        if (post.image) {
          const id = getPublicIdFromUrl(post.image);
          if (id) jobs.push(deleteMedia(id, "image"));
        }
        if (post.video) {
          const id = getPublicIdFromUrl(post.video);
          if (id) jobs.push(deleteMedia(id, "video"));
        }
        return jobs;
      }),
    );

    // 3. Delete from Prisma — cascade removes all related rows
    await prisma.user.delete({ where: { id: userId } });

    // 4. Delete from Supabase Auth using admin API.
    try {
      const { getSupabaseAdmin } = await import("./supabase-admin.server");
      const adminClient = getSupabaseAdmin();
      const { error } = await adminClient.auth.admin.deleteUser(userId);
      if (error) {
        console.error("[deleteAccount] Failed to delete auth user:", error.message);
        return { success: true, authDeleted: false };
      }
    } catch (adminErr: any) {
      console.error("[deleteAccount] Admin client error:", adminErr.message);
      return { success: true, authDeleted: false };
    }

    return { success: true, authDeleted: true };
  });
