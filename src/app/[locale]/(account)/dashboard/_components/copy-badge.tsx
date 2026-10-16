"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyBadgeProps {
  value: string;
  label?: string;
  truncate?: boolean;
  explorerUrl?: string;
  className?: string;
}

export function CopyBadge({
  value,
  label,
  truncate = true,
  explorerUrl,
  className,
}: CopyBadgeProps) {
  const [copied, setCopied] = useState(false);

  const displayValue = truncate && value.length > 20
    ? `${value.slice(0, 10)}…${value.slice(-8)}`
    : value;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(label ? `${label} copied to clipboard` : "Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-black/40 px-2.5 py-1 text-xs font-mono text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.04]",
        className,
      )}
    >
      <span className="select-all truncate">{displayValue}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded p-0.5 text-zinc-500 transition-colors hover:text-white"
        title="Copy to clipboard"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <Check className="size-3 text-emerald-400" />
        ) : (
          <Copy className="size-3 text-zinc-400 group-hover:text-zinc-200" />
        )}
      </button>
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded p-0.5 text-zinc-500 transition-colors hover:text-white"
          title="Open in block explorer"
          aria-label="Open in block explorer"
        >
          <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  );
}
