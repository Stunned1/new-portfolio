"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type Project = {
  /** Display title, e.g. "Liquid Glass UI" */
  title: string;
  /** Optional smaller, dimmer note after the title, e.g. "(Still Ongoing!)" */
  note?: string;
  /** Short year or context label shown top-right, e.g. "2026" */
  year: string;
  /** A few short tags / tech, e.g. ["Next.js", "WebGL"] */
  tags?: string[];
  /** Optional external link — wraps the whole card when present */
  href?: string;
  /** Path under /public, e.g. "/projects/liquid.mp4". Omit for a still image. */
  video?: string;
  /** Optional WebM source (smaller) — listed first when present */
  videoWebm?: string;
  /** Still image — used instead of a video (e.g. an unfinished project) */
  image?: string;
  /** Still image shown before the clip loads / when motion is reduced */
  poster?: string;
  /** Custom node rendered inside the frame instead of media (e.g. an app mock) */
  preview?: ReactNode;
  /** Render larger / full-width as a section hero */
  featured?: boolean;
  /** Skip the project frame — the preview owns its own styling (e.g. a window) */
  bare?: boolean;
};

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Respect prefers-reduced-motion: hold on the poster instead of looping.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Keep clips looping while on screen, pause when scrolled away (saves
  // battery/GPU — invisible to the viewer, the loop "never stops" for them).
  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;

    let visible = false;
    const playIfVisible = () => {
      if (visible) el.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) playIfVisible();
        else el.pause();
      },
      // Play as soon as any part of the clip is visible (even just a peek)
      { threshold: 0 }
    );
    io.observe(el);
    // Retry once the clip has enough data — the first play() can fire too early
    el.addEventListener("canplay", playIfVisible);
    return () => {
      io.disconnect();
      el.removeEventListener("canplay", playIfVisible);
    };
  }, [reducedMotion]);

  const num = String(index + 1).padStart(2, "0");

  // Bare previews skip the project frame and own their own styling
  if (project.bare) {
    return (
      <figure className="group block">
        {project.preview}
        <Caption num={num} project={project} />
      </figure>
    );
  }

  const card = (
    <figure className="group block">
      {/* Frame — shrink-wraps the media's native ratio (no bars, no crop) */}
      <div className="relative w-full overflow-hidden border border-[var(--page-fg)]/15 bg-[var(--color-carbon)]">
        {project.preview ? (
          project.preview
        ) : project.video ? (
          <video
            ref={videoRef}
            className="block h-auto w-full"
            poster={project.poster}
            muted
            loop
            playsInline
            autoPlay={!reducedMotion}
            preload="auto"
          >
            {project.videoWebm && (
              <source src={project.videoWebm} type="video/webm" />
            )}
            <source src={project.video} type="video/mp4" />
          </video>
        ) : (
          // Still image — slow Ken Burns drift gives the unfinished project life
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={project.title}
            className={`block h-auto w-full ${
              reducedMotion ? "" : "kenburns"
            }`}
          />
        )}

        {/* Hairline inner frame */}
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/5" />
        {/* Faint vignette for media (skipped for custom previews) */}
        {!project.preview && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
        )}

        {/* Year — top right (skipped for custom previews) */}
        {!project.preview && (
          <span className="absolute right-3 top-3 text-[11px] tabular-nums text-white/70">
            {project.year}
          </span>
        )}
      </div>

      <Caption num={num} project={project} />
    </figure>
  );

  if (project.href) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {card}
      </a>
    );
  }

  return card;
}

function Caption({ num, project }: { num: string; project: Project }) {
  return (
    <figcaption className="mt-4 flex items-baseline justify-between gap-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[11px] tabular-nums text-[var(--page-fg)]/40">
          {num}
        </span>
        <h3
          className={`font-light leading-[1.1] text-[var(--page-fg)] transition-opacity duration-200 group-hover:opacity-60 ${
            project.featured
              ? "text-[var(--text-heading-sm)]"
              : "text-[var(--text-subheading)]"
          }`}
        >
          {project.title}
          {project.note && (
            <span className="ml-2 text-[0.6em] text-[var(--page-fg)]/40">
              {project.note}
            </span>
          )}
        </h3>
      </div>
      {/* Technologies hidden for now — re-enable when ready
      {project.tags && project.tags.length > 0 && (
        <span className="hidden whitespace-nowrap text-[12px] text-[var(--page-fg)]/50 sm:block">
          {project.tags.join(" · ")}
        </span>
      )}
      */}
    </figcaption>
  );
}
