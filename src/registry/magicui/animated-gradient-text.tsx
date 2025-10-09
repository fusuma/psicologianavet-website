import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({ children, className }: AnimatedGradientTextProps) {
  return (
    <span className={cn("inline animate-gradient bg-gradient-to-r from-[#d946a6] via-[#22d3ee] via-[#fbbf24] to-[#d946a6] bg-[length:300%_100%] bg-clip-text text-transparent", className)}>
      {children}
    </span>
  );
}
