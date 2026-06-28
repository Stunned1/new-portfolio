import ProjectCard, { type Project } from "@/components/ProjectCard";
import OrcaPreview from "@/components/OrcaPreview";
import MacTerminal from "@/components/MacTerminal";

// Drop your clips in /public/projects/ and point `video` at them.
// 3–6s, muted, ideally exported as both .webm (small) and .mp4 (fallback).
const PROJECTS: Project[] = [
  {
    title: "Scout - Google Solutions Challenge Finalist",
    note: "(Still Ongoing!)",
    year: "2026",
    tags: ["Next.js", "WebGL"],
    video: "/projects/one.mp4",
    href: "https://github.com/Stunned1/Scout-Portfolio-Redirect",
    featured: true,
    // videoWebm: "/projects/one.webm",
    // poster: "/projects/one.jpg",
    // href: "https://example.com",
  },
  {
    title: "Orca",
    year: "2025",
    tags: ["React", "Three.js"],
    preview: <OrcaPreview />,
  },
  {
    title: "Steam Portfolio Recreation",
    year: "2025",
    tags: ["TypeScript", "Motion"],
    video: "/projects/three.mp4",
    href: "https://portfolio-aidans-projects-cf539d11.vercel.app",
  },
  {
    title: "Tsukora",
    year: "2025",
    tags: ["Python", "AI"],
    preview: <MacTerminal />,
    bare: true,
  },
];

export default function Projects() {
  return (
    <section
      id="work"
      className="relative z-20 -mt-[12vh] px-6 pb-[var(--spacing-152)] pt-[var(--spacing-12)] sm:px-12"
    >
      <div className="flex flex-col gap-y-[var(--spacing-64)]">
        {/* Row 1 — featured project + two stacked small projects */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-[var(--spacing-64)] md:grid-cols-[65fr_35fr]">
          <ProjectCard project={PROJECTS[0]} index={0} />

          {/* Stacked in the narrow right column, spread to align bottoms */}
          <div className="flex flex-col gap-y-[var(--spacing-64)] md:h-full md:justify-between md:gap-y-0">
            <ProjectCard project={PROJECTS[1]} index={1} />
            <ProjectCard project={PROJECTS[2]} index={2} />
          </div>
        </div>

        {/* Row 2 — half-width projects (one more to come) */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-[var(--spacing-64)] md:grid-cols-2">
          <ProjectCard project={PROJECTS[3]} index={3} />
        </div>

        <p className="text-center text-[12px] uppercase tracking-wide text-[var(--page-fg)]/40">
          (adding more project cards!)
        </p>
      </div>
    </section>
  );
}
