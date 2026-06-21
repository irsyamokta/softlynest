import logo from "@/assets/logo.svg";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
}

const Logo = ({ className, variant = "full" }: LogoProps) => {
  return (
    <a href="#beranda" className={cn("inline-flex items-center gap-2 select-none", className)}>
      <img
        src={logo}
        alt="SIPBANGDES — Sistem Perencanaan Pembangunan Desa"
        className={cn("object-contain", variant === "full" ? "h-9 md:h-10" : "h-8")}
      />
    </a>
  );
};

export default Logo;
