import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-border/40 soft-shadow my-4 min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink/20 to-yellow/20 flex items-center justify-center mb-4 ring-8 ring-white">
        <Icon className="w-8 h-8 text-cyan" strokeWidth={2} />
      </div>
      <h3 className="text-xl font-extrabold text-black mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
