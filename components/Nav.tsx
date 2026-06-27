// ABOUT and CONTACT hidden for now — restore when those sections are ready
const MENU = ["WORK"];
const ACTIVE = "WORK";

export default function Nav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-20 flex items-start justify-between px-6 pt-14 pb-8 md:px-12 md:pt-16">
      <a
        href="#"
        className="text-[16px] tracking-tight text-[var(--page-fg)] md:ml-[6vw]"
      >
        <span className="font-semibold">aidan</span>{" "}
        <span className="font-normal text-[var(--page-fg)]/70">nguyen</span>
      </a>

      <div className="flex flex-col items-end gap-[10px] md:mr-[6vw]">
        {MENU.map((item) => {
          const isActive = item === ACTIVE;
          return (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`flex items-center gap-2 text-[12px] uppercase tracking-wide transition-colors ${
                isActive
                  ? "text-[var(--page-fg)]"
                  : "text-[var(--page-fg)]/50 hover:text-[var(--page-fg)]"
              }`}
            >
              {isActive && <span aria-hidden>→</span>}
              {item}
            </a>
          );
        })}
        <span className="text-[12px] uppercase tracking-wide text-[var(--page-fg)]/50">
          SITE WIP (June 2026)
        </span>
      </div>
    </nav>
  );
}
