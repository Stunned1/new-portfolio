"use client";

import { useCallback, useEffect, useState } from "react";
import { ASK_AIDAN_EVENT } from "@/components/ChatPanel";

type Pos = { top: number; left: number };

export default function AskAidan() {
  const [pos, setPos] = useState<Pos | null>(null);
  const [text, setText] = useState("");

  const updateFromSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setPos(null);
      return;
    }

    const selected = selection.toString().trim();
    if (!selected) {
      setPos(null);
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setPos(null);
      return;
    }

    setText(selected);
    setPos({ top: rect.top, left: rect.left + rect.width / 2 });
  }, []);

  useEffect(() => {
    // Recompute after the selection settles (mouseup / keyup), and clear it when it collapses
    const onMouseUp = () => requestAnimationFrame(updateFromSelection);
    const onSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) setPos(null);
    };

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keyup", onMouseUp);
    document.addEventListener("selectionchange", onSelectionChange);
    window.addEventListener("scroll", () => setPos(null), true);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keyup", onMouseUp);
      document.removeEventListener("selectionchange", onSelectionChange);
      window.removeEventListener("scroll", () => setPos(null), true);
    };
  }, [updateFromSelection]);

  if (!pos) return null;

  return (
    <button
      // Keep the text selection alive when pressing the button
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent(ASK_AIDAN_EVENT, { detail: text }),
        );
        setPos(null);
      }}
      style={{
        top: pos.top,
        left: pos.left,
        transform: "translate(-50%, calc(-100% - 10px))",
      }}
      className="fixed z-[9998] flex items-center gap-1.5 whitespace-nowrap rounded-[75px] bg-paper-white px-3.5 py-1.5 text-[12px] font-normal text-ink-black shadow-sm transition-transform duration-150 hover:scale-[1.03]"
    >
      <span aria-hidden>✦</span>
      Ask Aidan
    </button>
  );
}
