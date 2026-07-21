"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getTokenLogo } from "@/lib/token-logos";

interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

export function TokenIcon({ symbol, size = 32, className }: TokenIconProps) {
  const src = getTokenLogo(symbol);
  const [failed, setFailed] = useState(false);
  const label = symbol.toUpperCase();

  if (!src || failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-neutral-700 text-white font-bold shrink-0",
          className
        )}
        style={{ width: size, height: size, fontSize: size * 0.35 }}
        aria-hidden
      >
        {label[0]}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={label}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className={cn("rounded-full object-cover shrink-0", className)}
    />
  );
}
