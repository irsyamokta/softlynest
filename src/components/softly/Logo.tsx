export function Logo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = { sm: "text-2xl", md: "text-3xl", lg: "text-4xl md:text-5xl", xl: "text-5xl md:text-7xl" }[size];
  return (
    <span className={`logo-script ${sizes} ${className}`}>
      <span className="text-cream drop-shadow-sm">Softly</span>
      <span className="text-cyan-light">nest</span>
    </span>
  );
}
