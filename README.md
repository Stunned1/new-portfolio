# Portfolio

A dark, editorial-style developer portfolio built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Make it yours

Almost everything is content-driven — edit **`app/data.ts`**:

- `site` — your name, role, nav links, intro headline, and blurb.
- `experience` — the year / company / title list on the right of the hero.
- `projects` — the "Selected Work" cards. Each `visual` is one of
  `"sync" | "bars" | "logs" | "grid"` (defined in `components/ProjectVisuals.tsx`).

Colors and fonts live in `tailwind.config.ts` and `app/layout.tsx`.

## Build

```bash
npm run build
npm start
```
