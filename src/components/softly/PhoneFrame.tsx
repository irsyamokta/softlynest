import type { ReactNode } from "react";

/* Responsive app shell.
   - Mobile: full-bleed, single column.
   - Desktop: full width canvas (no phone frame), content area expands. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-[100dvh] w-full bg-cream">
      <div className="h-[100dvh] w-full bg-cream flex flex-col">
        {children}
      </div>
    </div>
  );
}
