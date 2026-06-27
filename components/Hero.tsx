import Nav from "@/components/Nav";
import LiquidBackground from "@/components/LiquidBackground";
import Experience from "@/components/Experience";
import RotatingHeadline from "@/components/RotatingHeadline";

export default function Hero() {
  return (
    <section className="bg-ink-black relative flex h-screen min-h-[640px] flex-col overflow-hidden">
      {/* Animated liquid-glass field, reactive to the cursor */}
      <LiquidBackground />

      <Nav />

      {/* Editorial split — statement on the left, experience on the right */}
      <div className="relative z-10 flex flex-1 flex-col justify-center gap-12 px-6 md:px-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-[6vw]">
        <RotatingHeadline />

        <Experience />
      </div>

      {/* Fade the liquid field into the page background at the bottom edge */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[35vh]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--page-bg) 60%, transparent) 55%, var(--page-bg) 100%)",
        }}
      />
    </section>
  );
}
