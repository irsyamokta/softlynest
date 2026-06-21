import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 200);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ animation: isClosing ? "fadeOut 0.2s forwards" : "fadeIn 0.2s ease-out" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-3xl soft-shadow w-full max-w-[320px] overflow-hidden text-center flex flex-col items-center justify-center"
        style={{ animation: isClosing ? "popOut 0.2s forwards" : "popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-5 w-full flex flex-col gap-2">
          <h2 className="text-lg font-extrabold text-black leading-tight">{title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <div className="w-full flex border-t border-border/40">
          <button
            onClick={handleClose}
            className="flex-1 py-3.5 text-sm font-bold text-muted-foreground hover:bg-muted/50 transition cursor-pointer"
          >
            {cancelText}
          </button>
          <div className="w-[1px] bg-border/40" />
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3.5 text-sm font-extrabold transition cursor-pointer ${
              variant === "danger"
                ? "text-red-500 hover:bg-red-50"
                : "text-cyan hover:bg-cyan/10"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes popIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        @keyframes popOut { from { transform: scale(1); opacity: 1 } to { transform: scale(0.95); opacity: 0 } }
      `}</style>
    </div>,
    document.body
  );
}
