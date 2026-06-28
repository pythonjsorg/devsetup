# Extending the site

Everything lives in the single Astro app `apps/web`. Pick the pattern that matches what you're adding.

## Add a dev tool (`/devtools`)
1. Add an entry to `TOOLS` in `apps/web/src/data/tools.ts` (and its id to the `ToolId` union).
2. Add the `tips` field (verify command + up to 3 hello commands).
3. `cd apps/web && npx astro check`. The tool page, sitemap entry, and "related tools" on peers
   are all generated from the catalog — no other files to touch. (New *category*? see
   `docs/codebase.md` → Category system.)

## Add a marketing section (home page)
1. Create `apps/web/src/components/<Section>.astro` (follow an existing one, e.g. `WorkBento.astro`;
   reuse design-system primitives `.sec` / `.sec-head` / `.kicker` / `.btn` / `.reveal`).
2. Import it into `apps/web/src/pages/index.astro` in the desired order.
3. Add any section-specific CSS to `apps/web/src/styles/app.css` (responsive rules in `mobile.css`,
   keeping the ≤640px-centers / ≥641px-left-aligned convention).

## Add a journal article (`/journal`)
1. Create `apps/web/src/pages/journal/<slug>.astro` using `layouts/Article.astro` (pass its props:
   title, category, dek, date, readtime, tags, `keep`, `cta`).
2. Add a teaser card to `components/JournalTeasers.astro` linking `/journal/<slug>`.

## Add a new top-level directory (e.g. `/monitoring`)
Prefer **routes inside `apps/web`** — it keeps one deploy and one SEO surface:
1. Add `apps/web/src/pages/monitoring/…` pages (+ a layout if it needs its own shell).
2. Reuse the design system (already imported globally) and the shared `Nav`/`Footer`.
3. It's covered by the sitemap and the existing Vercel deploy automatically.

## Spin up a separate app (only if it must deploy independently)
The design system is framework-agnostic, so a separate site (its own repo or `apps/<name>`, on its
own domain/subdomain like `app.pythonjs.org`) can adopt it with zero duplication:
1. Add `@pythonjs/design-system` as a dependency.
2. `@import "@pythonjs/design-system/tokens.css"` then `base.css` globally
   (+ `tailwind-theme.css` if using Tailwind utilities).
3. Wire theming from `@pythonjs/design-system/theme`: inline `THEME_BOOT_SCRIPT` in `<head>` before
   paint, give the toggle `id="themeToggle"`, call `initThemeToggle('#themeToggle')`, and add a
   `<meta name="theme-color">`. See `packages/design-system/README.md`.

> Note: there is intentionally **no multi-zone proxy** anymore. Serving a separate app under a
> `pythonjs.org/<path>` would mean re-introducing a Vercel rewrite to that app's deploy — only do
> that if the surface genuinely can't live as routes inside `apps/web`. A subdomain is usually simpler.
