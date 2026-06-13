# Multi-Zones Setup — pythonjs.org/devtools

**Goal:** Serve this app at `https://pythonjs.org/devtools` (subdirectory) instead of a subdomain,
so all services compound one domain's SEO authority. Each service stays an independent Vercel
project; a root app at the apex rewrites path prefixes to each zone (Next.js Multi-Zones).

## Architecture

```
pythonjs.org  (ROOT app — currently "Create Next App" boilerplate on Vercel)
  ├─ /                      → root app's own pages
  ├─ /devtools/:path*       → rewrite → this app's *.vercel.app deployment
  └─ /monitoring/:path*     → rewrite → monitoring zone (future)
```

- **This repo = the `/devtools` zone.** Runs with `basePath: '/devtools'`, deployed as a normal
  Next app on Vercel (NOT static export). Keeps its own `.vercel.app` URL.
- **Root app** owns the apex domain, `robots.txt`, and the rewrites. Lives in the Vercel account
  that owns `pythonjs.org`.

## This repo's zone changes (done)

| File | Change |
|---|---|
| `next.config.ts` | removed `output: 'export'`; added `basePath: '/devtools'`; moved `/install/:tool` redirect here |
| `src/app/layout.tsx` | `metadataBase` = `https://pythonjs.org` (origin); root `canonical` = `/devtools`; OG url = `/devtools` |
| `src/app/tools/[tool]/page.tsx` | `canonical` / OG url = `/devtools/tools/${id}` |
| `src/app/sitemap.ts` | baseUrl = `https://pythonjs.org/devtools` |
| `public/robots.txt` | removed — robots is served by the ROOT app at `pythonjs.org/robots.txt`, not reachable under `/devtools` |
| `vercel.json` | redirects removed (moved to `next.config.ts`, which auto-applies basePath) |

Canonicals verified in emitted HTML: `https://pythonjs.org/devtools/tools/<id>`.

## Root app (apex) — TODO, NOT in this repo

Add to the root app's `next.config.ts` (replace the URL with this zone's actual deploy URL):

```ts
async rewrites() {
  return [
    { source: '/devtools', destination: 'https://<devtools-deploy>.vercel.app/devtools' },
    { source: '/devtools/:path*', destination: 'https://<devtools-deploy>.vercel.app/devtools/:path*' },
  ]
}
```

`basePath` puts the zone's `_next` assets under `/devtools/_next`, so the `:path*` rewrite
captures assets too — no separate asset rewrite needed.

Also on the root app:
- `public/robots.txt` with `Sitemap: https://pythonjs.org/devtools/sitemap.xml` (+ future zones).
- (Optional) keep the apex from indexing the boilerplate until it's real.

## Open dependency — account ownership

`akayjoshi's projects` (the CLI's current scope) owns **0 domains**, but `pythonjs.org` apex is
already live on Vercel → the apex/root app is in a **different Vercel account/team**. The root-app
rewrite must be deployed there. Resolve which account owns the apex before the final wiring.

## Ship sequence

1. ✅ Zone edits + build/grep verify (this repo)
2. Deploy this zone → capture its `*.vercel.app` URL
3. Add rewrites to root app (in the apex-owning account) → deploy
4. Verify `https://pythonjs.org/devtools` serves with a valid cert
5. Root `robots.txt` + GSC **domain property** for `pythonjs.org` + submit `pythonjs.org/devtools/sitemap.xml`

## Prevent the `.vercel.app` deploy from being indexed (dup content)

Canonical tags already point to `pythonjs.org/devtools`, which is the primary dedup signal.
Optionally add a noindex header for the raw `.vercel.app` host if it shows up in the index.
