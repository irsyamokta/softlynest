import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { ImagePlus, UserCircle2, X } from "lucide-react";
import { EmojiPicker } from "@/components/softly/EmojiPicker";
import { createPostFn } from "@/lib/post.server";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/post")({
  head: () => ({ meta: [{ title: "New post — Softlynest" }] }),
  component: PostPage,
});

function PostPage() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<{ url: string; type: "image" | "video"; file: File } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertEmoji = (emoji: string) => {
    const el = textareaRef.current;
    if (!el) { setText((v) => v + emoji); return; }
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;
    const newVal = text.slice(0, start) + emoji + text.slice(end);
    setText(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video/");

    // Size limit: 10MB for both video and image
    if (isVideo && file.size > 10 * 1024 * 1024) {
      toast.error("Video is too large. Max 10MB allowed.");
      e.target.value = "";
      return;
    } else if (!isVideo && file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large. Max 10MB allowed.");
      e.target.value = "";
      return;
    }

    if (isVideo) {
      // Check duration: max 60 seconds
      const url = URL.createObjectURL(file);
      const tempVideo = document.createElement("video");
      tempVideo.preload = "metadata";
      tempVideo.src = url;
      tempVideo.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        if (tempVideo.duration > 60) {
          toast.error("Video is too long. Max 1 minute (60 seconds) allowed.");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        setMedia({ url: URL.createObjectURL(file), type: "video", file });
      };
      tempVideo.onerror = () => {
        URL.revokeObjectURL(url);
        toast.error("Could not read video file. Please try another file.");
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      return;
    }

    const type = "image";
    const url = URL.createObjectURL(file);
    setMedia({ url, type, file });
  };

  const removeMedia = () => {
    if (media) URL.revokeObjectURL(media.url);
    setMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Max dimension: 1200px
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          // Compress with quality 0.7 (brings size down significantly)
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePost = async (anonymous: boolean) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to post");
        return;
      }

      let imageBase64;
      let videoBase64;

      if (media) {
        toast.loading("Uploading media...", { id: "post-upload" });
        if (media.type === "image") {
          imageBase64 = await compressImage(media.file);
        } else {
          videoBase64 = await fileToBase64(media.file);
        }
      }

      toast.loading("Creating post...", { id: "post-upload" });

      await createPostFn({
        data: {
          userId: user.id,
          text,
          imageBase64,
          videoBase64,
          anonymous,
        }
      });

      toast.success("Posted successfully!", { id: "post-upload" });
      navigate({ to: "/home" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create post", { id: "post-upload" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-4 flex flex-col h-full">
      <h2 className="text-xl font-extrabold mb-3">Share something soft</h2>

      <div className="bg-white border border-border/60 soft-shadow rounded-3xl p-4 flex-1 flex flex-col min-h-[260px]">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind today? Use #hashtags to get discovered!"
          className="w-full flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed placeholder:text-muted-foreground text-black min-h-[120px]"
        />

        {/* Detected hashtag chips */}
        {(() => {
          const tags = text.match(/#[\w\u00C0-\u017F]+/g);
          return tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[...new Set(tags)].map((tag) => (
                <span key={tag} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan/15 text-cyan">
                  {tag}
                </span>
              ))}
            </div>
          ) : null;
        })()}

        {media && (
          <div className="relative mt-2 rounded-xl overflow-hidden self-start">
            <button
              onClick={removeMedia}
              className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition z-10"
            >
              <X className="w-4 h-4" />
            </button>
            {media.type === "video" ? (
              <video src={media.url} className="max-h-[200px] object-cover" controls />
            ) : (
              <img src={media.url} alt="" className="max-h-[200px] object-cover" />
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/40">
          <EmojiPicker onEmojiSelect={insertEmoji} buttonClassName="text-muted-foreground hover:text-cyan transition cursor-pointer p-1.5" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ImagePlus className="w-4 h-4" /> Add image or video
          </button>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
        Likes are hidden on every post so you can share freely. You'll still see who supports you in your notifications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
        <button
          onClick={() => handlePost(false)}
          disabled={(!text.trim() && !media) || loading}
          className="rounded-full bg-cyan text-primary-foreground font-bold py-3 disabled:opacity-40 cursor-pointer"
        >
          {loading ? "Posting..." : "Post"}
        </button>
        <button
          onClick={() => handlePost(true)}
          disabled={(!text.trim() && !media) || loading}
          className="rounded-full bg-pink/15 text-pink font-bold py-3 inline-flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer"
        >
          <UserCircle2 className="w-4 h-4" /> {loading ? "Posting..." : "Post Anonymously"}
        </button>
      </div>
      <div className="h-4" />
    </div>
  );
}
