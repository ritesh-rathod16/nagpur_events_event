"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const fallbackCopy = (value: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);

    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textarea);
  };

  const handleCopy = async () => {
    if (typeof window === "undefined") return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
      fallbackCopy(text);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="px-4 py-2 bg-gold text-sapphire rounded font-poppins font-bold text-xs uppercase tracking-widest hover:bg-gold/90 transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
