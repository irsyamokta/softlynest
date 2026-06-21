import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export const uploadMedia = async (
  base64OrUrl: string,
  folder = "softlynest"
) => {
  try {
    const result = await cloudinary.uploader.upload(base64OrUrl, {
      folder,
      resource_type: "auto",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

export const deleteMedia = async (publicId: string, resourceType: "image" | "video" = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

export const replaceMedia = async (
  oldPublicId: string | null,
  newBase64OrUrl: string,
  folder = "softlynest",
  oldResourceType: "image" | "video" = "image"
) => {
  if (oldPublicId) {
    await deleteMedia(oldPublicId, oldResourceType);
  }
  return await uploadMedia(newBase64OrUrl, folder);
};

export const getPublicIdFromUrl = (url: string) => {
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const remaining = parts[1];
  const remainingParts = remaining.split('/');
  if (remainingParts.length > 1 && /^v\d+$/.test(remainingParts[0])) {
    remainingParts.shift();
  }
  const pathWithExtension = remainingParts.join('/');
  const lastDotIndex = pathWithExtension.lastIndexOf('.');
  if (lastDotIndex === -1) return pathWithExtension;
  return pathWithExtension.substring(0, lastDotIndex);
};
