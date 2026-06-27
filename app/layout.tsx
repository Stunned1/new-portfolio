import type { Metadata } from "next";
import { Inter, Raleway, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import Cursor from "@/components/Cursor";
import AskAidan from "@/components/AskAidan";
import ChatPanel from "@/components/ChatPanel";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

// Apply the saved theme before first paint to avoid a flash of the wrong mode
const THEME_SCRIPT = `(function(){try{if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light');}catch(e){}})();`;

// Roobert substitute — geometric neo-grotesque, weights 300/400/600
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Secondary editorial display presence
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-raleway",
  display: "swap",
});

// Editorial serif italic for the hero headline
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

// Altone — the Orca project's brand typeface (used only in its logo lockup)
const altone = localFont({
  src: [
    { path: "./fonts/Altone-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Altone-Italic.ttf", weight: "400", style: "italic" },
    { path: "./fonts/Altone-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Altone-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-altone",
  display: "swap",
});

// Apple system fonts for the Mac terminal mock
const sfPro = localFont({
  src: [
    { path: "./fonts/SF-Pro-Text-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/SF-Pro-Text-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});

const sfMono = localFont({
  src: "./fonts/SF-Mono-Regular.otf",
  variable: "--font-sf-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aidan Nguyen",
  description:
    "Portfolio of Aidan Nguyen — designer and developer crafting cinematic, editorial digital experiences.",
  icons: {
    icon: "/cheng-xiaoshi-pointing.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${raleway.variable} ${newsreader.variable} ${altone.variable} ${sfPro.variable} ${sfMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <Cursor />
        <ThemeToggle />
        <AskAidan />
        <ChatPanel />
        {children}
      </body>
    </html>
  );
}
