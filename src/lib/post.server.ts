import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./db.server";
import { uploadMedia, deleteMedia, getPublicIdFromUrl } from "./cloudinary.server";

// Simple hashtag extractor
const extractHashtags = (text: string) => {
  const matches = text.match(/#[\w]+/g);
  return matches ? matches.map((tag) => tag.substring(1).toLowerCase()) : [];
};

export const getFeedFn = createServerFn({ method: "POST" })
  .validator((data: { userId?: string }) => data)
  .handler(async ({ data }) => {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        _count: {
          select: { comments: true, likes: true, favorites: true },
        },
        likes: data.userId ? { where: { userId: data.userId } } : false,
        favorites: data.userId ? { where: { userId: data.userId } } : false,
      },
    });

    return posts.map(post => ({
      ...post,
      hasLiked: post.likes ? post.likes.length > 0 : false,
      hasFavorited: post.favorites ? post.favorites.length > 0 : false,
    }));
  });

export const createPostFn = createServerFn({ method: "POST" })
  .validator((data: { userId: string; text: string; imageBase64?: string; videoBase64?: string; anonymous?: boolean }) => data)
  .handler(async ({ data }) => {
    let imageUrl = null;
    let videoUrl = null;

    if (data.imageBase64) {
      const result = await uploadMedia(data.imageBase64, "softlynest/images");
      imageUrl = result.secure_url;
    }
    
    if (data.videoBase64) {
      const result = await uploadMedia(data.videoBase64, "softlynest/videos");
      videoUrl = result.secure_url;
    }

    const hashtags = extractHashtags(data.text);

    const post = await prisma.post.create({
      data: {
        userId: data.userId,
        text: data.text,
        image: imageUrl,
        video: videoUrl,
        anonymous: data.anonymous ?? false,
      },
    });

    // Handle hashtags
    for (const tag of hashtags) {
      const hashtagRecord = await prisma.hashtag.upsert({
        where: { name: tag },
        update: {},
        create: { name: tag },
      });

      await prisma.postHashtag.create({
        data: {
          postId: post.id,
          hashtagId: hashtagRecord.id,
        },
      });
    }

    return post;
  });

export const getHashtagsFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return await prisma.hashtag.findMany({
      take: 10,
      orderBy: { posts: { _count: "desc" } }
    });
  });

export const getExploreFeedFn = createServerFn({ method: "POST" })
  .validator((data: { userId?: string }) => data)
  .handler(async ({ data }) => {
    // Fetch recent posts to use as a pool for the explore page
    const posts = await prisma.post.findMany({
      take: 50,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        _count: {
          select: { comments: true, likes: true, favorites: true },
        },
        likes: data.userId ? { where: { userId: data.userId } } : false,
        favorites: data.userId ? { where: { userId: data.userId } } : false,
      },
    });

    // Shuffle array for randomness
    const shuffled = posts.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 15); // Return 15 random posts

    return selected.map(post => ({
      ...post,
      hasLiked: post.likes ? post.likes.length > 0 : false,
      hasFavorited: post.favorites ? post.favorites.length > 0 : false,
    }));
  });

export const searchPostsFn = createServerFn({ method: "POST" })
  .validator((data: { query: string; userId?: string }) => data)
  .handler(async ({ data }) => {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { text: { contains: data.query, mode: "insensitive" } },
          { hashtags: { some: { hashtag: { name: { contains: data.query, mode: "insensitive" } } } } }
        ]
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        _count: {
          select: { comments: true, likes: true, favorites: true },
        },
        likes: data.userId ? { where: { userId: data.userId } } : false,
        favorites: data.userId ? { where: { userId: data.userId } } : false,
      },
    });
    return posts.map(post => ({
      ...post,
      hasLiked: post.likes ? post.likes.length > 0 : false,
      hasFavorited: post.favorites ? post.favorites.length > 0 : false,
    }));
  });

export const getFavoritesFn = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data }) => {
    const favorites = await prisma.favorite.findMany({
      where: { userId: data },
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          include: {
            user: true,
            _count: {
              select: { comments: true, likes: true, favorites: true },
            },
            likes: { where: { userId: data } },
            favorites: { where: { userId: data } },
          }
        }
      }
    });

    return favorites.map(fav => ({
      ...fav.post,
      hasLiked: fav.post.likes ? fav.post.likes.length > 0 : false,
      hasFavorited: fav.post.favorites ? fav.post.favorites.length > 0 : false,
    }));
  });

export const getPostFn = createServerFn({ method: "POST" })
  .validator((data: { postId: string; userId?: string }) => data)
  .handler(async ({ data }) => {
    const post = await prisma.post.findUnique({
      where: { id: data.postId },
      include: {
        user: true,
        _count: {
          select: { comments: true, likes: true, favorites: true },
        },
        likes: data.userId ? { where: { userId: data.userId } } : false,
        favorites: data.userId ? { where: { userId: data.userId } } : false,
      },
    });

    if (!post) return null;

    return {
      ...post,
      hasLiked: post.likes ? post.likes.length > 0 : false,
      hasFavorited: post.favorites ? post.favorites.length > 0 : false,
    };
  });

export const getUserPostsFn = createServerFn({ method: "POST" })
  .validator((data: { targetUserId?: string; targetUsername?: string; currentUserId?: string }) => data)
  .handler(async ({ data }) => {
    // Viewer is the owner only when explicitly fetching by userId and it matches their own id
    const isOwnProfile = !!data.targetUserId && data.targetUserId === data.currentUserId;

    const posts = await prisma.post.findMany({
      where: {
        ...(data.targetUserId
          ? { userId: data.targetUserId }
          : { user: { username: data.targetUsername } }),
        // Hide anonymous posts from visitors — only the owner sees their own anon posts
        ...(!isOwnProfile && { anonymous: false }),
      },
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        _count: {
          select: { comments: true, likes: true, favorites: true },
        },
        likes: data.currentUserId ? { where: { userId: data.currentUserId } } : false,
        favorites: data.currentUserId ? { where: { userId: data.currentUserId } } : false,
      },
    });

    return posts.map(post => ({
      ...post,
      hasLiked: post.likes ? post.likes.length > 0 : false,
      hasFavorited: post.favorites ? post.favorites.length > 0 : false,
    }));
  });

export const deletePostFn = createServerFn({ method: "POST" })
  .validator((data: { postId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    const post = await prisma.post.findUnique({ where: { id: data.postId } });
    if (!post || post.userId !== data.userId) {
      throw new Error("Unauthorized to delete this post");
    }

    // Delete media from Cloudinary if exists
    if (post.image) {
      const publicId = getPublicIdFromUrl(post.image);
      if (publicId) {
        await deleteMedia(publicId, "image").catch((err) => {
          console.error("Failed to delete post image from Cloudinary:", err);
        });
      }
    }

    if (post.video) {
      const publicId = getPublicIdFromUrl(post.video);
      if (publicId) {
        await deleteMedia(publicId, "video").catch((err) => {
          console.error("Failed to delete post video from Cloudinary:", err);
        });
      }
    }

    await prisma.post.delete({
      where: { id: data.postId },
    });
    return { success: true };
  });
