"use client";

import { useEffect, useState } from "react";

export const ASK_AIDAN_EVENT = "ask-aidan";

export default function ChatPanel() {
  const [open, setOpen] = useState(false);

  // Open the panel when the "Ask Aidan" selection button fires its event.
  // The feature is still a work in progress, so we just show a placeholder.
  useEffect(() => {
    const onAsk = () => setOpen(true);
    window.addEventListener(ASK_AIDAN_EVENT, onAsk);
    return () => window.removeEventListener(ASK_AIDAN_EVENT, onAsk);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[9990] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className={`bg-ink-black text-paper-white fixed right-0 top-0 z-[9991] flex h-full w-full max-w-[420px] flex-col border-l border-white/10 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-2 text-[14px]">
            <span aria-hidden>✦</span>
            <span className="font-semibold">Ask Aidan</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-paper-white/60 hover:text-paper-white text-[18px] leading-none transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-3 overflow-y-auto px-8 py-6 text-center">
          <span aria-hidden className="text-[28px]">✦</span>
          <p className="text-paper-white text-[16px] font-semibold">
            Still a work in progress
          </p>
          <p className="text-paper-white/50 text-[14px] leading-relaxed">
            “Ask Aidan” isn’t live yet. I’m still building it, so check back soon.
          </p>
        </div>
      </aside>
    </>
  );
}
