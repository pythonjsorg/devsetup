# @pythonjs/design-system

The single source of truth for the pythonjs.org design language (warm greige/terracotta,
light/dark). Framework-agnostic — shipped as raw CSS, consumed by the Astro site and the
Next.js devtools app alike. No build step.

## Exports

| Import | What it is |
|---|---|
| `@pythonjs/design-system/tokens.css` | Design tokens — colors, type, radii, shadows, easing. Light `:root` + `[data-theme="dark"]`. **Import once, globally.** |
| `@pythonjs/design-system/base.css` | Reset + global primitives: `.wrap` `.sec` `.kicker` `.btn` `.chip` `.tlink` `.reveal` `.atmos` `.progress` + View-Transition theme reveal. Import **after** tokens. |
| `@pythonjs/design-system/fonts.css` | Google Fonts `@import` (Bricolage Grotesque / Hanken Grotesk / JetBrains Mono). Prefer `<link>` in `<head>` for performance. |
| `@pythonjs/design-system/tailwind-theme.css` | Optional Tailwind v4 `@theme` bridge (tokens → utilities). For apps using Tailwind color/font utilities. |
| `@pythonjs/design-system/theme` | Framework-agnostic theme JS: `THEME_BOOT_SCRIPT` (anti-flash), `initThemeToggle()`, `getInitialTheme/applyTheme/toggleTheme`. The shared `data-theme` + `pyjs.theme` contract — don't re-implement it per site. |

## Usage

**Astro (apps/web)** — in `src/styles/global.css`:
```css
@import "@pythonjs/design-system/tokens.css";
@import "@pythonjs/design-system/base.css";
/* (fonts via <link> in Base.astro <head> for speed) */
```

**Next.js + Tailwind v4 (apps/devtools)** — in `globals.css`:
```css
@import "tailwindcss";
@import "@pythonjs/design-system/tokens.css";
/* app maps its existing token names to these via an alias layer */
```

## Theme

`data-theme="light" | "dark"` on `<html>`. Persisted in `localStorage` under `pyjs.theme`,
defaulting to `prefers-color-scheme`. Set it before paint with an inline boot script to avoid FOUC.

## Source

Tokens and primitives are ported verbatim from the `Pythonjs.zip` design handoff
(`design_handoff_pythonjs/tokens.css` and `reference/css/v2-base.css`).
