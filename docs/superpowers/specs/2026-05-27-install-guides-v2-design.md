# Install Guides v2 — Design Spec

**Date:** 2026-05-27  
**Scope:** Phase 1 — Install Guides section only  
**Status:** Awaiting user review  

---

## Context

devsetup.sh is a static Next.js 15 site (`output: 'export'`) that provides step-by-step install guides for dev tools, pinned to LTS where applicable, with dependency resolution (e.g. installing Claude CLI automatically shows "Step 1: Install Node.js" first).

Phase 1 completes and extends the existing Install Guides section. Phases 2+ (DB Command Reference, CLI Reference, Tool Comparisons) are separate specs to be written after Phase 1 ships.

---

## Phase 1 Deliverables

### 1. Route rename: `/install/[tool]` → `/tools/[tool]`

The `/install/` prefix is redundant — the whole site is about installing tools. Rename the route directory:

- `src/app/install/[tool]/page.tsx` → `src/app/tools/[tool]/page.tsx`
- Update all `href` references in `ToolCard.tsx` (`/install/${tool.id}` → `/tools/${tool.id}`)
- Update breadcrumb in `InstallGuide.tsx` (`install` → `tools`)
- Sitemap in `src/app/sitemap.ts` updates automatically via `getAllTools()`
- Add a redirect in `next.config.ts`: `/install/:tool` → `/tools/:tool` (preserves any existing bookmarks/links)

*Default chosen — flag if you want different.*

---

### 2. Four new tools in the catalog

Add to `src/data/tools.ts` (TOOLS array + ToolId union):

| Tool | Category | Dependencies | Notes |
|---|---|---|---|
| **Gemini CLI** | ai-tool | nodejs | Google's AI terminal agent. `npm install -g @google/gemini-cli` |
| **Deno** | runtime | — | Standalone. Homebrew / curl installer |
| **Docker** | platform | — | Standalone. Platform-specific installers |
| **Git** | vcs | — | Standalone. See note below |

**New category:** `platform` and `vcs` are needed for Docker and Git respectively. Add both to the `Tool['category']` union and to the `CAT` map in `ToolCard.tsx` and `InstallGuide.tsx`.

**Git note:** Git is a stylistic outlier. On macOS it ships with Xcode Command Line Tools (not a clean `brew install git` equivalent that most users want to manage that way — though `brew install git` works). On Windows it's a dedicated installer (git-scm.com). On Linux it's `apt install git`. Git also has no LTS concept. The homepage "100% LTS-pinned" stat will need a caveat or rewrite — *Default: reword to "LTS where applicable".*

---

### 3. Slim per-tool tips section

Added below the success banner on each install page. Content per tool lives in `tools.ts` as an optional `tips` field.

**Shape:**
```ts
tips?: {
  verify: string                             // confirm install, e.g. "bun --version"
  hello?: { cmd: string; label: string }[]   // up to 3 first-run commands
  cliRef?: string                            // stub: "/cli/<tool>" — Phase 2
}
```

**UI:** A single card section titled "Get started" placed after the success banner. Shows:
1. A `verify` command block (copy-ready)
2. Up to 3 `hello` commands with short labels
3. A muted "Full CLI reference coming soon →" link stub pointing to `/cli/<tool>` (not yet a live route)

Tools without a `tips` entry render nothing — the section is fully optional.

*Default chosen — flag if you want a richer tutorial instead.*

---

### 4. Flat tab nav — section groundwork

Add a top navigation bar to `src/app/layout.tsx` with four tabs:

| Tab | Route | State in Phase 1 |
|---|---|---|
| Install | `/` | Active |
| DB Commands | `/db` | Disabled — "soon" badge |
| CLI Reference | `/cli` | Disabled — "soon" badge |
| Compare | `/compare` | Disabled — "soon" badge |

Disabled tabs are visually muted with a small "soon" pill. They are not links (no `<a>` href) — just `<span>` elements. This plants the navigation structure without building the other sections.

*Default chosen — flag if you prefer to add the other tabs only when their sections ship.*

---

## What This Spec Does NOT Cover (Phase 2+)

These are explicitly out of scope for Phase 1. Each gets its own spec:

- **DB Command Reference** — PostgreSQL, ClickHouse, MySQL day-to-day commands (permissions, user CRUD, etc.)
- **CLI Reference** — per-tool command cheat sheets at `/cli/[tool]`
- **Tool Comparisons** — Bun vs Node, uv vs pip, Claude CLI vs Codex, etc.

---

## Constraints

- `output: 'export'` — fully static, no server-side runtime. All pages must be statically generated. New tool pages and the tips section are fully compatible with this.
- No new dependencies required for Phase 1.
- Existing `src/data/tools.ts` → `src/lib/catalog.ts` → page pattern is the single source of truth. All new tools follow the same pattern.

---

## Files Changed in Phase 1

| File | Change |
|---|---|
| `src/data/tools.ts` | Add 4 tools, add `tips` field to Tool type, extend ToolId union, add `platform`/`vcs` categories |
| `src/lib/catalog.ts` | No changes expected |
| `src/app/tools/[tool]/page.tsx` | New location (moved from `install/`) |
| `src/app/install/[tool]/page.tsx` | Delete after move (redirect in next.config.ts covers old URLs) |
| `src/app/layout.tsx` | Add flat tab nav (Install active; DB/CLI/Compare as muted "soon" stubs) |
| `src/app/page.tsx` | Update "100% LTS-pinned" stat copy |
| `src/components/ToolCard.tsx` | Update href, add platform/vcs to CAT map |
| `src/components/InstallGuide.tsx` | Update breadcrumb, add tips section rendering |
| `src/app/sitemap.ts` | No changes — auto-picks up new tools |
| `next.config.ts` | Add `/install/:tool` → `/tools/:tool` redirect |
