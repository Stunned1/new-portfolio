const EXPERIENCE = [
  {
    year: "2026",
    company: "CACI International Inc.",
    role: "Software Engineering Intern",
    href: "https://www.caci.com/",
  },
  {
    year: "2025",
    company: "Virginia Tech: Code World, No Blanket",
    role: "Undergraduate Researcher",
    href: "https://code-world-no-blanket.github.io",
  },
];

export default function Experience() {
  return (
    <ul className="grid grid-cols-[3rem_1fr] items-baseline gap-x-6 gap-y-[10px] text-[13px] sm:grid-cols-[3rem_auto_auto] sm:gap-x-8 md:text-[14px]">
      {EXPERIENCE.map((e) => (
        <li key={`${e.company}-${e.year}`} className="contents">
          <span className="text-[var(--page-fg)]/40 tabular-nums">{e.year}</span>
          {e.href ? (
            <a
              href={e.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-[var(--page-fg)] transition-colors duration-200 hover:text-[var(--page-fg)]/40"
            >
              {e.company}
            </a>
          ) : (
            <span className="text-[var(--page-fg)]">{e.company}</span>
          )}
          <span className="col-span-2 text-[var(--page-fg)]/50 sm:col-span-1 sm:whitespace-nowrap">
            {e.role}
          </span>
        </li>
      ))}
    </ul>
  );
}
