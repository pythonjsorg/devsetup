import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s — DevSetup",
    default: "DevSetup — Install any dev tool correctly",
  },
  description:
    "Step-by-step install guides for Node.js, Bun, uv, Claude CLI, Codex, and more. LTS versions only. All dependencies included.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950">
        {/* Site header */}
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
          <div className="mx-auto flex h-12 max-w-4xl items-center px-6">
            <Link
              href="/"
              className="text-sm font-semibold text-zinc-900 hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300 transition-colors"
            >
              DevSetup
            </Link>
          </div>
        </header>

        {/* Page content */}
        <div className="flex flex-1 flex-col">{children}</div>

        {/* Site footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-6 py-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
            DevSetup &middot; Install any dev tool correctly &middot; LTS
            versions only
          </div>
        </footer>
      </body>
    </html>
  );
}
