# DevSetup — Codebase Reference

## Identity
- **What:** Static site with step-by-step install guides for dev tools. Dependency resolution (installing Codex auto-shows Node.js first).
- **Live URL:** https://downloader-mauve.vercel.app
- **Repo:** `git@github.com-personal:pythonjsorg/devsetup.git`
- **Branch:** `feat/devsetup-app`
- **Deploy:** `git push origin feat/devsetup-app && npx vercel --prod`

## Stack
- Next.js 15, App Router, `output: 'export'` (fully static — no server runtime)
- TypeScript 5, Tailwind CSS v4
- No test runner — use `npx tsc --noEmit` to verify, `npm run build` for full check
- Vercel for hosting; redirects via `vercel.json` (not `next.config.ts` — redirects don't work in static exports)

## Data Flow
```
src/data/tools.ts   ← single source of truth (TOOLS array, types)
       ↓
src/lib/catalog.ts  ← getAllTools(), getTool(id), resolveDeps(id)
       ↓
src/app/tools/[tool]/page.tsx  ← server component, generateStaticParams + generateMetadata
       ↓
src/components/InstallGuide.tsx  ← renders OS picker + steps + tips
```

## Key File Map

| File | Purpose |
|---|---|
| `src/data/tools.ts` | All tool data, types (Tool, ToolId, InstallMethods, ToolTip, LtsEntry) |
| `src/lib/catalog.ts` | Three functions only — getAllTools, getTool, resolveDeps |
| `src/app/page.tsx` | Home page — hero + stat strip + FilterableGrid |
| `src/app/tools/[tool]/page.tsx` | Tool install page — generateMetadata + JSON-LD |
| `src/app/layout.tsx` | Root layout — header (tab nav), footer, theme boot script |
| `src/app/globals.css` | CSS custom properties for all 3 themes |
| `src/app/sitemap.ts` | Auto-generates sitemap from getAllTools() |
| `src/components/InstallGuide.tsx` | Main install page UI — OS picker, steps, success banner, tips |
| `src/components/ToolCard.tsx` | Card on home page — category badge, name, link to /tools/:id |
| `src/components/FilterableGrid.tsx` | Home page grid with category filter chips |
| `src/components/SearchBar.tsx` | Search input — navigates to /tools/:id on select |
| `src/components/StepCard.tsx` | Single install step card (used inside InstallGuide) |
| `src/components/CommandBlock.tsx` | Copy-ready code block component |
| `src/components/LtsBadge.tsx` | LTS version badge |
| `src/components/LtsPopover.tsx` | "What is LTS?" popover on home page (client component) |
| `src/components/Icon.tsx` | SVG icon component — IconName union + PATHS map |
| `src/components/ThemeSwitcher.tsx` | Paper/Carbon/Cobalt theme toggle |
| `vercel.json` | CDN redirect: /install/:tool → /tools/:tool |
| `handoff/` | Frozen delivery snapshot — excluded from tsconfig, do not edit |

## Key Types (tools.ts)

```typescript
type ToolId = 'nodejs' | 'bun' | 'uv' | 'claude-cli' | 'codex-cli' | 'gemini-cli' | 'deno' | 'docker' | 'git'

type InstallMethods = {
  homebrew?: string[]   // macOS
  nvm?: string[]        // macOS/Linux
  winget?: string[]     // Windows
  apt?: string[]        // Linux
  curl?: string[]       // any
  manual?: string[]     // any
}

type ToolTip = {
  verify: string                            // e.g. "node --version"
  hello?: { cmd: string; label: string }[]  // up to 3 first-run commands
  cliRef?: string                           // stub: "/cli/<tool>" — not live yet
}

type Tool = {
  id: string
  name: string
  description: string
  category: 'runtime' | 'ai-tool' | 'package-manager' | 'platform' | 'vcs'
  dependencies: ToolId[]
  lts: { version: string; label: string } | null
  ltsVersions: LtsEntry[]
  install: Record<OS, InstallMethods>
  tips?: ToolTip
}
```

## Category System

Each category has a CSS variable pair (`--cat-<name>-bg` / `--cat-<name>-fg`) defined in all 3 themes in `globals.css`. When adding a new category:
1. Add to `Tool['category']` union in `tools.ts`
2. Add CSS vars to all 3 theme blocks in `globals.css`
3. Add icon to `Icon.tsx` (IconName + PATHS)
4. Add to CAT map in: `ToolCard.tsx`, `StepCard.tsx`, `InstallGuide.tsx` (4 maps), `FilterableGrid.tsx` (chip list), `SearchBar.tsx`

## CSS Theme System

Three themes toggled via `data-theme` on `<html>`: `paper` (light), `carbon` (dark), `cobalt` (blue-light).
All colours are CSS custom properties — never use hardcoded hex in components, always `var(--token-name)`.
Boot script in `themeBootScript.ts` applies saved theme before React hydrates (prevents FOUC).

## Navigation Structure (layout.tsx)

Header: logo · Install (active Link) · DB Cmds (span, soon) · CLI Ref (span, soon) · Compare (span, soon) · ThemeSwitcher · SearchBar
Footer: "LTS where applicable · Dependencies resolved automatically" · Changelog · DevSetup

## Related Tools Rule

**Related tools are derived automatically from the catalog — never set manually.**

`ToolInfo.tsx` computes: `getAllTools().filter(t => t.category === tool.category && t.id !== tool.id)`

This means:
- Adding a new tool in an existing category automatically appears on all peer tools' pages
- No `related` field exists on `ToolContent` — do not add one
- The only things to author per tool are `about` (prose) and `comparisons` (cross-category compare stubs)

## Adding a New Tool

1. Add entry to `TOOLS` array in `src/data/tools.ts`
2. Add id to `ToolId` union
3. Add `tips` field (verify + hello commands)
4. Run `npx tsc --noEmit` — no other files need touching for new tools

## Planned Phases (not yet built)
- Phase 2: DB Command Reference (`/db`) — PostgreSQL, MySQL, ClickHouse day-to-day commands
- Phase 3: CLI Reference (`/cli/[tool]`) — per-tool command cheat sheets
- Phase 4: Tool Comparisons (`/compare`) — Bun vs Node, uv vs pip, etc.
