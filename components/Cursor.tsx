"use client";

import { useEffect, useRef, useState } from "react";

// Elements that should make the cursor react
const INTERACTIVE = 'a, button, [role="button"], input, textarea, [data-cursor]';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Track the theme — dark mode inverts (mix-blend), light mode is a static colour
  useEffect(() => {
    const update = () =>
      setIsDark(!document.documentElement.classList.contains("light"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    // Skip on touch / coarse-pointer devices — a custom cursor only makes sense with a mouse
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let frame = 0;
    let isHover = false;
    const move = (e: MouseEvent) => {
      setVisible(true);
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // position via the standalone `translate` property so it stays instant,
        // leaving `transform` (scale) free to animate without lagging the dot
        dot.style.translate = `calc(${clientX}px - 50%) calc(${clientY}px - 50%)`;
      });

      // grow the cursor over anything clickable (only flips state on change)
      const over = !!(e.target as Element)?.closest?.(INTERACTIVE);
      if (over !== isHover) {
        isHover = over;
        setHovering(over);
      }
    };

    const hide = () => setVisible(false);
    const down = () => setPressed(true);
    const up = () => setPressed(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseleave", hide);
    document.documentElement.classList.add("cursor-none");

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", hide);
      document.documentElement.classList.remove("cursor-none");
    };
  }, []);

  // hover grows the dot; a click dips it inward — combined into one scale
  const scale = (hovering ? 1.8 : 1) * (pressed ? 0.7 : 1);
  // solid colour; fades a little when over something clickable
  const opacity = visible ? (hovering ? 0.45 : 1) : 0;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className={`pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-[var(--cursor)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isDark ? "mix-blend-difference" : ""
      }`}
      style={{ opacity, transform: `scale(${scale})` }}
    />
  );
}
