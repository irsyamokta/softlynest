import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";

const EMOJI_CATEGORIES: { label: string; emojis: string[] }[] = [
  {
    label: "Soft & Kind",
    emojis: ["🥺", "💗", "🌸", "🌿", "✨", "💫", "🌱", "🍵", "☕", "🌙", "🌊", "💙", "🩷", "🤍", "🌼", "🌻", "🫶", "🤗", "😊", "🥰"],
  },
  {
    label: "Feelings",
    emojis: ["😔", "😢", "😭", "😩", "😤", "😅", "😂", "🥲", "😐", "😶", "🫠", "😴", "🥱", "😪", "🤒", "🤯", "😵", "🫥", "😑", "😏"],
  },
  {
    label: "Gestures",
    emojis: ["👍", "👏", "🙌", "🤝", "🫂", "🤜", "✌️", "🤞", "🫰", "👌", "🙏", "💪", "🦾", "🫁", "🧠", "👀", "💌", "📝", "🎉", "🎊"],
  },
  {
    label: "Nature",
    emojis: ["🌸", "🌹", "🌺", "🌻", "🌼", "🍀", "🌿", "🍃", "🌱", "🌾", "🍂", "🍁", "🌈", "⭐", "🌟", "💫", "☀️", "🌤️", "🌙", "❄️"],
  },
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  buttonClassName?: string;
}

export function EmojiPicker({ onEmojiSelect, buttonClassName }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open emoji picker"
        className={buttonClassName ?? "text-foreground/60 hover:text-cyan transition cursor-pointer p-2"}
      >
        <Smile className="w-6 h-6" strokeWidth={2} />
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 left-0 z-50 w-72 bg-white rounded-xl shadow-xl border border-border/60 overflow-hidden"
          style={{ animation: "slideUp 0.15s ease-out" }}
        >
          {/* Tabs */}
          <div className="flex border-b border-border/40 overflow-x-auto scrollbar-none">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActiveTab(i)}
                className={`flex-1 text-[10px] font-bold py-2 px-1 whitespace-nowrap transition cursor-pointer ${
                  activeTab === i ? "text-cyan border-b-2 border-cyan" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-3 grid grid-cols-8 gap-1 max-h-44 overflow-y-auto">
            {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  onEmojiSelect(emoji);
                  setOpen(false);
                }}
                className="text-xl w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted transition cursor-pointer"
                aria-label={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
