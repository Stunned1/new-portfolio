"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const USER = "aidannguyen";

// zsh prompt: white "aidannguyen@Mac ~ %"
function Prompt() {
  return <span className="text-[#e8e8e8]">{`${USER}@Mac ~ % `}</span>;
}

// Tsukora chat prompt
function ChatPrompt() {
  return <span className="text-[#e8e8e8]">{"> "}</span>;
}

type Line = { kind: "zsh" | "chat" | "output"; content: ReactNode };

// Boot: launch Tsukora, greeting
const INITIAL: Line[] = [
  { kind: "zsh", content: "python3 Tsukora.py" },
  { kind: "chat", content: "What can I help you with?" },
];

export default function MacTerminal() {
  const [history, setHistory] = useState<Line[]>(INITIAL);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Keep the latest line in view as the user types/asks
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history, input]);

  function submit() {
    const q = input;
    setInput("");
    if (!q.trim()) return;
    // Echo the question, then Tsukora's canned reply
    setHistory((h) => [
      ...h,
      { kind: "chat", content: q },
      {
        kind: "chat",
        content: (
          <>
            Check me out on{" "}
            <a
              href="https://github.com/Stunned1/Tsukora"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6ab0f3] underline underline-offset-2 hover:text-[#8cc4f7]"
            >
              github
            </a>{" "}
            for more! I&apos;m Aidan&apos;s very first project!
          </>
        ),
      },
    ]);
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[10px] border border-[#070707] bg-[#1c1d1e] shadow-[0_18px_50px_rgba(0,0,0,0.55)]">
      {/* Title bar */}
      <div className="relative flex items-center border-b border-[#070707] bg-[#1c1d1e] px-[10px] py-2">
        {/* Traffic lights — reveal symbols on hover, dim on click */}
        <div className="group/traffic flex items-center gap-2">
          <button
            type="button"
            aria-label="close"
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5c60] transition active:brightness-75"
          >
            <svg
              viewBox="0 0 10 10"
              className="h-2 w-2 opacity-0 transition-opacity group-hover/traffic:opacity-100"
              stroke="#000"
              strokeOpacity={0.5}
              strokeWidth={1.4}
              strokeLinecap="round"
            >
              <line x1="2.6" y1="2.6" x2="7.4" y2="7.4" />
              <line x1="7.4" y1="2.6" x2="2.6" y2="7.4" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="minimize"
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#fac800] transition active:brightness-75"
          >
            <svg
              viewBox="0 0 10 10"
              className="h-2 w-2 opacity-0 transition-opacity group-hover/traffic:opacity-100"
              stroke="#000"
              strokeOpacity={0.5}
              strokeWidth={1.4}
              strokeLinecap="round"
            >
              <line x1="2.2" y1="5" x2="7.8" y2="5" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="fullscreen"
            className="flex h-3 w-3 items-center justify-center rounded-full bg-[#35c759] transition active:brightness-75"
          >
            <svg
              viewBox="0 0 10 10"
              className="h-2 w-2 opacity-0 transition-opacity group-hover/traffic:opacity-100"
              fill="#000"
              fillOpacity={0.5}
            >
              <path d="M2.2 2.2 L6 2.2 L2.2 6 Z" />
              <path d="M7.8 7.8 L4 7.8 L7.8 4 Z" />
            </svg>
          </button>
        </div>

        {/* Title (left-aligned) with folder icon */}
        <div className="ml-3 flex items-center gap-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/projects/MacFolder.png" alt="" className="h-4 w-4" />
          <span
            className="text-[13px] font-bold text-[#98999a]"
            style={{ fontFamily: "var(--font-sf-pro)" }}
          >
            {USER} — -zsh — 120×30
          </span>
        </div>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        className="h-[calc(100%-33px)] cursor-text overflow-y-auto bg-[#212733] p-3 text-[11px] leading-[1.5] text-[#e8e8e8]"
        style={{ fontFamily: "var(--font-sf-mono)" }}
      >
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {line.kind === "zsh" && <Prompt />}
            {line.kind === "chat" && <ChatPrompt />}
            {line.content}
          </div>
        ))}

        {/* Live input line — Tsukora chat prompt */}
        <div className="whitespace-pre-wrap break-words">
          <ChatPrompt />
          {input}
          <span className="terminal-cursor ml-[1px] inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] bg-[#c4c4c4]/90 align-baseline" />
        </div>

        {/* Hidden input captures typing; clicking the body focuses it */}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          className="absolute h-0 w-0 opacity-0"
          aria-label="terminal input"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
