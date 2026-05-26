import type { Metadata } from "next";
import { Syne, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
      className={`${syne.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        {/* Header */}
        <header
          className="sticky top-0 z-50"
          style={{
            borderBottom: '1px solid var(--border-col)',
            background: 'rgba(8,10,8,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <span
                className="flex h-6 w-6 items-center justify-center text-xs font-bold"
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  fontFamily: 'var(--font-geist-mono)',
                }}
              >
                &gt;_
              </span>
              <span
                className="text-sm font-bold tracking-widest uppercase transition-colors"
                style={{ color: 'var(--fg)', letterSpacing: '0.15em' }}
              >
                DevSetup
              </span>
            </Link>
            <span
              className="hidden sm:block text-xs font-mono"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)' }}
            >
              v1.0.0
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col">{children}</div>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--border-col)' }}>
          <div
            className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between"
          >
            <span className="text-xs font-mono" style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)' }}>
              LTS versions only · Dependencies resolved automatically
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--muted)', fontFamily: 'var(--font-geist-mono)' }}>
              DevSetup
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
