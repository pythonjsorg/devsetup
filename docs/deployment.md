# Deployment — pythonjs.org

The whole site is **one Astro static app** (`apps/web`) deployed as a **single Vercel project**.
Marketing, `/devtools`, and `/journal` all ship together. No multi-zone proxy.

## Vercel project
- **Root Directory:** `apps/web`
- **Framework preset:** Astro (auto-detected) · build `astro build` · output `dist`
- **Install:** default — Vercel detects the Turborepo/npm workspace and installs from the repo
  root, which is required so the `@pythonjs/design-system` workspace dependency resolves. If a build
  ever fails on a missing `@pythonjs/design-system`, set the Install Command to `npm install` (root).
- Must live in the Vercel **team/account that owns the `pythonjs.org` apex domain**.

## Build note — Rollup native binary (npm/cli#4828)
The build toolchain (Rollup, esbuild, Lightning CSS, Tailwind Oxide, sharp) ships **per-platform
native binaries** as os/cpu-gated optional deps. Because our `package-lock.json` is generated on
macOS, npm's optional-deps bug ([npm/cli#4828](https://github.com/npm/cli/issues/4828)) omits the
**Linux** binaries' lockfile entries — so Vercel's Linux build can't find them (e.g.
`@rollup/rollup-linux-x64-gnu`, `lightningcss.linux-x64-gnu.node`) and `astro build` fails. Fix: the
root `package.json` pins each Linux x64/glibc binary in `optionalDependencies` (os-gated, so they're
no-ops on macOS): `@rollup/rollup-linux-x64-gnu`, `@esbuild/linux-x64`, `lightningcss-linux-x64-gnu`,
`@tailwindcss/oxide-linux-x64-gnu`, `@img/sharp-linux-x64`, `@img/sharp-libvips-linux-x64`.
**Keep each pin's version in lockstep with its parent** — if you upgrade astro/vite/tailwind/etc.,
re-derive the versions from the lockfile (each pin must byte-match its parent package's version).
Do **not** `rm package-lock.json && npm install` to "fix" deps — the `^` ranges will pull newer,
build-breaking Vite/Tailwind; treat the lockfile as load-bearing and build-test any regeneration.

## First-time deploy
1. **Decommission any old project** still wired to this repo (e.g. a former `devtools` project) —
   delete it or disconnect its Git so it doesn't auto-deploy stale output.
2. Merge to `main` and push.
3. Vercel → **Add New → Project** → import the repo → set **Root Directory `apps/web`** → deploy.
   (CLI: `cd apps/web && npx vercel link` then `npx vercel --prod`.)
4. **Domain:** project → Settings → Domains → add `pythonjs.org` (+ `www` → redirect to apex).
   DNS is on Cloudflare pointing at Vercel; keep records **DNS-only (grey cloud)** so Vercel issues TLS.

## SEO (built in)
- `@astrojs/sitemap` emits `dist/sitemap-index.xml` (+ `sitemap-0.xml`) at build.
- `public/robots.txt` points at `https://pythonjs.org/sitemap-index.xml`.
- Every page emits a self-referencing `<link rel="canonical">` (via `Astro.site` in the layouts).
- After deploy: Google Search Console → **Domain property** for `pythonjs.org` → submit `sitemap-index.xml`.

## Verify live
`https://pythonjs.org/` · `/devtools` · `/devtools/tools/nodejs` · `/journal/the-automation-audit`
· `/sitemap-index.xml` · `/robots.txt`.

## History (why one app, not multi-zone)
This started as two apps — a Next.js `/devtools` zone proxied from an Astro root via Next.js
Multi-Zones (`basePath` + `rewrites`). It was **consolidated into the single Astro app** above:
one deploy, one domain, simpler ops, and all content compounding one domain's SEO authority
without cross-zone rewrites. The devtools React UI was ported in as Astro **React islands**
(`apps/web/src/components/devtools/*.tsx`). If you ever genuinely need an independently-deployed
app under a path again, see the "separate app" note in `docs/extending.md`.
