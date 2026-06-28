# pythonjs.org — Codebase Reference

> **Architecture (2026-06):** Turborepo monorepo (npm workspaces) with **one app** and one
> shared package:
> - **`apps/web/`** — the entire `pythonjs.org` site, a single **Astro (static)** project:
>   the marketing site **and** the DevSetup install guides under **`/devtools`** **and** the
>   `/journal` articles. (The former standalone Next.js devtools zone was migrated in here and
>   removed — there is no multi-zone proxy anymore.)
> - **`packages/design-system/`** — shared, framework-agnostic design language (CSS tokens +
>   primitives + theme JS) consumed by `apps/web` and any future app. See its `README.md`.
>
> Design language: shared light/dark **terracotta/greige** system (Bricolage Grotesque /
> Hanken Grotesk / JetBrains Mono). Two themes only — `data-theme="light|dark"`.
> Build/check from root: `npx turbo run build` · `cd apps/web && npx astro check`.
> Deploy: see `docs/deployment.md`. Extend (add a tool / section / new app): `docs/extending.md`.

## Identity
- **What:** The pythonjs.org developer-studio site. Includes **DevSetup** — step-by-step install
  guides for dev tools with automatic dependency resolution (installing Codex auto-shows Node.js first).
- **Live URL:** `https://pythonjs.org` (marketing) · `https://pythonjs.org/devtools` (install guides)
  · `https://pythonjs.org/journal/*` (articles). All one deploy.
- **Repo:** `git@github.com-personal:pythonjsorg/devsetup.git`
- **Deploy:** Vercel project with **Root Directory `apps/web`**. See `docs/deployment.md`.

## Stack
- **Astro 6**, `output: 'static'`. Integrations: `@astrojs/react` (React islands for the
  interactive devtools UI), `@astrojs/sitemap` (auto sitemap), Tailwind v4 via `@tailwindcss/vite`.
- TypeScript 5. `@/*` alias → `apps/web/src/*`.
- No test runner — verify with `npx astro check` (types) + `npx turbo run build`.
- Marketing & journal UI = `.astro` + a small vanilla `scripts/interactions.ts`.
  Devtools UI = **React islands** (`components/devtools/*.tsx`), hydrated on the Astro pages.

## Surfaces (all in `apps/web/src`)

| Surface | Pages | Layout | Components | Styles |
|---|---|---|---|---|
| **Marketing** (`/`) | `pages/index.astro` | `layouts/Base.astro` | `components/*.astro` (Hero, StatsBand, WorkBento, ServicesAccordion, Team, DocsGrid, Testimonials, JournalTeasers, ContactCard, Nav, Footer, ThemeToggle, Atmos) | `app.css`, `contact.css`, `ux.css`, `mobile.css` |
| **Journal** (`/journal/*`) | `pages/journal/*.astro` | `layouts/Article.astro` | — | `article.css` |
| **DevSetup** (`/devtools`) | `pages/devtools/index.astro`, `changelog.astro`, `tools/[tool].astro` | `layouts/DevtoolsLayout.astro` | `components/devtools/*.tsx` (React islands) | `devtools.css` |

`styles/global.css` imports the design-system (`tokens.css` → `base.css`) then the marketing
CSS in cascade order; `devtools.css` is loaded for the `/devtools` surface.

## DevSetup data flow
```
src/data/tools.ts   ← single source of truth (TOOLS array + types)
       ↓
src/lib/catalog.ts  ← getAllTools(), getTool(id), resolveDeps(id)
       ↓
src/pages/devtools/tools/[tool].astro  ← getStaticParams + per-page <head> meta + JSON-LD
       ↓
src/components/devtools/InstallGuide.tsx  ← React island: OS picker + steps + tips
```
`src/lib/devtools-paths.ts` prefixes internal devtools hrefs with `/devtools` (no framework
basePath anymore — Astro serves the pages at that path directly).

## Key Types (`src/data/tools.ts`)
```typescript
type ToolId = 'nodejs' | 'bun' | 'uv' | 'claude-cli' | 'codex-cli' | 'gemini-cli' | 'deno' | 'docker' | 'git'

type InstallMethods = { homebrew?: string[]; nvm?: string[]; winget?: string[]; apt?: string[]; curl?: string[]; manual?: string[] }
type ToolTip = { verify: string; hello?: { cmd: string; label: string }[]; cliRef?: string }

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

## Category system
Each category has a `--cat-<name>-bg` / `--cat-<name>-fg` pair, defined for **light + dark** in
`src/styles/devtools.css`. Categories: `runtime`, `ai-tool`, `package-manager`, `platform`, `vcs`.
To add one: add to the `Tool['category']` union in `tools.ts`; add the CSS var pair (light + dark)
in `devtools.css`; add the icon in `components/devtools/Icon.tsx`; add it to the CAT maps in the
devtools components that switch on category.

## Theme system
Two themes via `data-theme="light|dark"` on `<html>`, persisted at `localStorage["pyjs.theme"]`,
default from `prefers-color-scheme`. All colors are design-system CSS tokens — never hardcode hex,
always `var(--token)`. Anti-flash boot script runs before paint (see `@pythonjs/design-system/theme`
`THEME_BOOT_SCRIPT`, inlined in the layouts). Marketing toggle = `ThemeToggle.astro` + `interactions.ts`;
devtools toggle = `components/devtools/ThemeSwitcher.tsx`.

## Related tools rule
Related tools are derived from the catalog, never set manually:
`getAllTools().filter(t => t.category === tool.category && t.id !== tool.id)`. Adding a tool in a
category automatically surfaces it on its peers' pages. Per tool you only author `about` prose and
any `comparisons` stubs.

## Adding a new tool
1. Add an entry to `TOOLS` in `src/data/tools.ts` (and its id to the `ToolId` union).
2. Add the `tips` field (verify + hello commands).
3. `cd apps/web && npx astro check` — no other files need touching.

(More patterns — adding a marketing section, a journal post, or a whole new app — in `docs/extending.md`.)

## Planned phases (not yet built)
- DB Command Reference (`/devtools/db`) · CLI Reference (`/devtools/cli/[tool]`) · Comparisons (`/devtools/compare`).
