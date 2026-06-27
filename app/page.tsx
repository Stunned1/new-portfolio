import Hero from "@/components/Hero";
import Projects from "@/components/Projects";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--page-fg)]">
      <Hero />
      <Projects />
    </main>
  );
}
