"use client";

import { useEffect, useState } from "react";

// Roles that read naturally after "I'm Aidan, a ___" — swap to your own
const PHRASES = ["Software Engineer", "Researcher", "Student"];

const STAGGER = 0.15; // seconds between each word
const ENTER_BASE = 1.3; // matches the entrance delay in globals.css
const NBSP = " ";

export default function RotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return; // hold on the first role

    const id = setInterval(() => {
      setStarted(true);
      setIndex((i) => {
        setPrev(i); // the outgoing role animates up and out
        return (i + 1) % PHRASES.length;
      });
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const words = PHRASES[index].split(" ");
  const prevWords = prev !== null ? PHRASES[prev].split(" ") : [];

  return (
    <h1
      className="text-[var(--page-fg)]"
      style={{
        fontWeight: 400,
        lineHeight: 0.92,
        fontSize: "clamp(26px, 3.6vw, 56px)",
        fontFamily: "var(--font-serif), Georgia, serif",
        whiteSpace: "nowrap",
      }}
    >
      {"I'm Aidan, a "}
      {/* Rotating role slot — italic, words slide up one after another */}
      <span
        className="relative inline-block align-baseline"
        style={{ fontStyle: "italic" }}
      >
        <span key={index} className="inline-block">
          {words.map((w, wi) => (
            <span
              key={wi}
              className={`inline-block ${started ? "phrase-enter" : ""}`}
              style={{ animationDelay: `${ENTER_BASE + wi * STAGGER}s` }}
            >
              {w}
              {wi < words.length - 1 ? NBSP : ""}
            </span>
          ))}
        </span>

        {prev !== null && (
          <span
            key={`prev-${prev}`}
            className="absolute left-0 top-0 inline-block"
          >
            {prevWords.map((w, wi) => (
              <span
                key={wi}
                className="phrase-exit inline-block"
                style={{ animationDelay: `${wi * STAGGER}s` }}
                onAnimationEnd={
                  wi === prevWords.length - 1 ? () => setPrev(null) : undefined
                }
              >
                {w}
                {wi < prevWords.length - 1 ? NBSP : ""}
              </span>
            ))}
          </span>
        )}
      </span>
    </h1>
  );
}
