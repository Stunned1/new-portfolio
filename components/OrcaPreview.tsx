// Recreation of the Orca app's sign-in screen, used as the Orca project card.
// Sizing is in container-query units (cqi) so it scales with the card width.
export default function OrcaPreview() {
  return (
    <div className="@container relative aspect-video w-full overflow-hidden bg-[#171a21]">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Logo lockup */}
        <div className="flex items-center gap-[2cqi]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/projects/orca_logo.png"
            alt="Orca logo"
            className="h-[6cqi] w-auto brightness-0 invert"
          />
          <span
            className="text-[7cqi] leading-none text-white"
            style={{ fontFamily: "var(--font-altone)" }}
          >
            Orca
          </span>
        </div>

        {/* Continue with GitHub — hover reveals a blue border */}
        <a
          href="https://github.com/Stunned1/Orca"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-[6cqi] flex items-center justify-center gap-[2.2cqi] rounded-[2cqi] border border-white/[0.06] bg-[#21262d] px-[8cqi] py-[2.6cqi] text-[3.2cqi] font-bold text-white transition-colors duration-200 hover:border-[#4d8dff]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-[3.5cqi] w-[3.5cqi]"
            aria-hidden="true"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          Continue with GitHub
        </a>
      </div>

      {/* Version — bottom right */}
      <span className="absolute bottom-[2.5cqi] right-[3cqi] text-[2.6cqi] text-[#5b6270]">
        v0.1.0
      </span>
    </div>
  );
}
