# Adding a new site / zone

How to spin up a new pythonjs property (e.g. `monitoring`, `status`, a new product site)
that **shares the design system** and slots into the multi-zone architecture.

Every site is an independent app under `apps/`, deploys on its own Vercel project, and
consumes the single shared design language from `packages/design-system`. The root Astro
app (`apps/web` = `pythonjs.org`) stitches them together by **path** so the whole thing
reads as one domain.

```
pythonjs.org            → apps/web        (Astro root)
pythonjs.org/devtools   → apps/devtools   (Next zone, basePath /devtools)
pythonjs.org/<new>      → apps/<new>       (your new zone)
```

---

## 1. Create the app

Pick the framework by job: **Astro** for content/marketing/docs (fastest, near-zero JS),
**Next.js** for app-like/interactive zones. Add it under `apps/<name>` with a scoped package
name and the design-system as a workspace dependency:

```jsonc
// apps/<name>/package.json
{
  "name": "@pythonjs/<name>",
  "private": true,
  "dependencies": { "@pythonjs/design-system": "*" }
}
```

Then `npm install` from the repo root — workspaces link it automatically. `turbo run build`
will pick it up with no extra config.

## 2. Consume the design system

Import the shared CSS **once, globally**, in cascade order (tokens → base → your styles):

```css
/* Astro: src/styles/global.css   ·   Next.js: src/app/globals.css */
@import "@pythonjs/design-system/tokens.css";   /* colors, type, radii, shadows (light/dark) */
@import "@pythonjs/design-system/base.css";     /* reset + .wrap/.sec/.btn/.chip/.reveal/… */
/* …then your zone-specific styles */
```

- **Tailwind v4 app?** also `@import "@pythonjs/design-system/tailwind-theme.css"` after
  `@import "tailwindcss"` to get `bg-bg`, `text-accent`, `font-display`, etc.
- **Fonts:** for speed, add the `<link rel="preconnect">` + Google Fonts `<link>` in your
  `<head>` (see `apps/web/src/layouts/Base.astro`). Next.js: use `next/font` and keep the CSS
  var names `--font-geist`/`--font-instrument-serif`/`--font-jetbrains` (see
  `apps/devtools/src/app/layout.tsx` + the alias block in its `globals.css`).

## 3. Wire theming (don't re-implement it)

Use the shared, framework-agnostic theme contract from `@pythonjs/design-system/theme`
so every site behaves identically (`data-theme` on `<html>`, key `pyjs.theme`, system default):

```js
import { THEME_BOOT_SCRIPT, initThemeToggle } from "@pythonjs/design-system/theme";
```

- **Anti-flash:** inline `THEME_BOOT_SCRIPT` in `<head>` *before* any paint.
  Astro: `<script is:inline set:html={THEME_BOOT_SCRIPT} />` · Next: `dangerouslySetInnerHTML`.
- **Toggle button:** give it `id="themeToggle"` and call `initThemeToggle('#themeToggle')`
  from a client script. You get the circular View-Transition reveal for free (it relies on the
  `.vt-clip` rules already in `base.css`).
- Add `<meta name="theme-color" content="#f5efe8" />` so the boot script can flip it.

Also expose `getInitialTheme`, `applyTheme`, `toggleTheme` for custom UIs (e.g. a React switch).

## 4. Slot it into the domain (multi-zone)

A zone serves under a path prefix, so it must know its own base path **and** be rewritten to
from the root app.

1. **In the zone**, set the base path so all routes + assets are prefixed:
   - Next.js: `basePath: '/<name>'` in `next.config.ts` (see `apps/devtools`).
   - Astro: `base: '/<name>'` in `astro.config.mjs`.
2. **In the root app** (`apps/web/vercel.json`), add a rewrite to the zone's deploy URL:
   ```jsonc
   { "source": "/<name>",          "destination": "https://<zone>.vercel.app/<name>" },
   { "source": "/<name>/:path*",   "destination": "https://<zone>.vercel.app/<name>/:path*" }
   ```
   Use the zone's **stable** `*.vercel.app` alias, never a per-deploy URL.
3. **SEO:** canonical URLs and the sitemap base must be `https://pythonjs.org/<name>/…`
   (mirror what `apps/devtools` does). Add the zone's sitemap to `apps/web/public/robots.txt`.

## 5. Deploy

Create a Vercel project for `apps/<name>` with **Root Directory = `apps/<name>`**. Each zone
deploys independently; turbo-ignore ensures only changed apps rebuild. The root app
(`apps/web`) must live in the Vercel account that owns the `pythonjs.org` apex.
See [`multi-zone-setup.md`](./multi-zone-setup.md) for the account/ownership details.

---

## Checklist

- [ ] `apps/<name>` with `@pythonjs/design-system` dep, `npm install` from root
- [ ] `@import` tokens.css + base.css globally (+ tailwind-theme.css if Tailwind)
- [ ] Fonts in `<head>` (or `next/font`)
- [ ] `THEME_BOOT_SCRIPT` inline in head + `initThemeToggle` + theme-color meta
- [ ] basePath/base = `/<name>`; canonical + sitemap under `/pythonjs.org/<name>`
- [ ] rewrite added to `apps/web/vercel.json`; sitemap added to root `robots.txt`
- [ ] Vercel project, Root Directory `apps/<name>`
