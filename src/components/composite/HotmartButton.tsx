'use client';

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/registry/magicui/animated-gradient-text";

interface HotmartButtonProps {
  href: string;
  className?: string;
  theme?: 'dark' | 'green';
}

export function HotmartButton({ href, className, theme = 'dark' }: HotmartButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] bg-[rgb(25,23,35)]",
        className
      )}
    >
      {theme !== 'green' && (
        <span
          className="animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#d946a6]/60 via-[#22d3ee]/60 via-[#fbbf24]/60 to-[#d946a6]/60 bg-[length:300%_100%] p-[1px]"
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />
      )}
      <Image
        src="/images/hotmart-flame-icon.svg"
        alt="Hotmart"
        width={16}
        height={16}
        className="shrink-0"
      />
      <hr className={cn("mx-2 h-4 w-px shrink-0", theme === 'green' ? "bg-white/30" : "bg-neutral-500")} />
      <span className={cn(
        "inline animate-gradient bg-[length:300%_100%] bg-clip-text text-transparent text-sm font-medium",
        theme === 'green'
          ? "bg-gradient-to-r from-white via-[#bfdbfe] via-[#60a5fa] to-white"
          : "bg-gradient-to-r from-[#d946a6] via-[#22d3ee] via-[#fbbf24] to-[#d946a6]"
      )}>
        Comprar no Hotmart
      </span>
      <ChevronRight className={cn("ml-1 size-4 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5", theme === 'green' ? "stroke-white/70" : "stroke-neutral-500")} />
    </Link>
  );
}
