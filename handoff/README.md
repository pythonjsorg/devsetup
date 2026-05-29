# DevSetup — Design handoff

A drop-in redesign for `pythonjsorg/devsetup` (branch `feat/devsetup-app`).
Component-by-component replacement of `src/**` files — no new runtime dependencies.

## What's in here

| File | Action | Notes |
|---|---|---|
| `src/app/globals.css` | **replace** | New tokens + 3 themes (Paper / Carbon / Cobalt). Old `--bg`/`--fg`/`--accent` names kept as aliases so any unseen code keeps working. |
| `src/app/layout.tsx` | **replace** | Swaps Syne → Geist + Instrument Serif. New header with search field + `<ThemeSwitcher>`. Sets `data-theme` on `<html>`. |
| `src/app/page.tsx` | **replace** | Hero with serif italic accent, stat strip, filter chips, 3-col tool grid. |
| `src/components/Icon.tsx` | **new** | Lucide-style inline SVG. No `lucide-react` dependency needed. |
| `src/components/ThemeSwitcher.tsx` | **new** | Client component. Reads `localStorage('devsetup-theme')`, writes `data-theme` on `<html>`. |
| `src/components/ToolCard.tsx` | **replace** | New card: icon chip + category pill + LTS chip + footer with deps/standalone + install arrow. |
| `src/components/LtsBadge.tsx` | **replace** | Pill with dot. |
| `src/components/InstallGuide.tsx` | **replace** | New header + success banner. |
| `src/components/StepCard.tsx` | **replace** | Target vs dependency distinction (current step gets primary border + tinted bg). |
| `src/components/CommandBlock.tsx` | **replace** | Dark code panel using `--code-bg`/`--code-fg`/`--code-prompt`. Copy button logic preserved. |
| `src/components/OsPicker.tsx` | **replace** | Pill-style segmented control on muted track. |

## Install

```bash
# from your devsetup repo root, on a fresh branch
git checkout -b design/redesign-v2

# copy the handoff/src tree over your src tree
# (or selectively copy file by file and review diffs as you go)
cp -r path/to/this-project/handoff/src/. src/

npm run dev
# open http://localhost:3000 — should render in Paper theme
```

No new dependencies. Existing `tools.ts`, `catalog.ts`, `install/[tool]/page.tsx`, `sitemap.ts`, `not-found.tsx` are unchanged.

## Choosing the default theme

`globals.css` ships **Paper** as `:root`. To change the default:

1. Open `src/app/globals.css`
2. Find `:root, [data-theme="paper"] { ... }` and `[data-theme="carbon"] { ... }` etc.
3. Move the `:root,` prefix to the theme you want as default.

OR just leave it — the `<ThemeSwitcher>` will remember each user's choice in `localStorage`.

## Fonts

The new stack is loaded via `next/font/google`:

- **Heading + body** — `Geist` (replaces Syne)
- **Serif italic accent** — `Instrument Serif` (used sparingly for the single italic word in headlines)
- **Mono** — `JetBrains Mono` (replaces Geist Mono)

All three are on Google Fonts; no licensing concerns; self-hosted by Next at build time.

## Visual rationale

| Before | After |
|---|---|
| Acid lime `#c8fa00` on near-black `#080a08` | **Paper** — warm cream `#f4ede0` w/ violet `#5b3df5` + lime `#cdff5b` accent |
| One palette only | 3 themes, user-switchable, persisted to localStorage |
| Grid + grain texture | Clean — texture removed; rhythm comes from cards + type |
| Syne (display) — strong but generic | Geist + Instrument Serif italic — distinctive, dev-tool-coded |
| Sharp 0-radius cards | Soft 22px cards on Paper/Cobalt; sharper on Carbon for terminal feel |
| Tool cards mostly text | Cards lead with category icon chip + label, end with explicit "install →" |
| Install step ghost numeral | Step circle in primary, "target" vs "dependency" label, success banner at end |

The Carbon theme is a callback to the original brutalist aesthetic — the lime is still there, but elevated. Users who liked the original UX can pick it and feel at home.

## A note on the install detail page

`src/app/install/[tool]/page.tsx` is unchanged — it still renders `<InstallGuide>`, which is itself rewritten. Same data model, same data fetching, same routes. Only visuals change.

## Verifying after install

Quick checks once running:

- [ ] Homepage hero renders with "*correctly*" in violet italic serif
- [ ] Theme switcher swatches in header — click each, layout reflows cleanly
- [ ] Refresh page — theme choice persists
- [ ] Visit `/install/claude-cli` — step 1 (Node) and step 2 (Claude) render; step 2 has primary-color border; success banner at bottom
- [ ] On Carbon theme, code blocks still readable (no contrast bug)
- [ ] OS picker — clicking macOS / Windows / Linux switches commands; choice persists across refresh

If any of those fail, ping me and I'll send a fix.
