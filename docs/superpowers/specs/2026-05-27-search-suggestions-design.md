# Search Suggestions Design

**Date:** 2026-05-27  
**Status:** Approved

## Problem

The current SearchBar updates `?q=` in the URL on every keystroke, which live-filters the home page tool grid. This is jarring — the page layout shifts as you type and there is no path from search to the dedicated install page for a tool.

## Goal

Replace URL-driven grid filtering with an inline typeahead suggestions dropdown. Selecting a suggestion navigates to `/install/[tool]`.

## Scope

- `src/components/SearchBar.tsx` — primary change
- `src/components/FilterableGrid.tsx` — remove `?q=` dependency
- `handoff/` directory — archive, no changes

---

## Architecture

### SearchBar

**State:**
- `query: string` — controlled input value (local state only, no URL sync)
- `open: boolean` — dropdown visibility
- `highlighted: number` — index of keyboard-highlighted suggestion (-1 = none)

**Data source:** Import `TOOLS` directly from `@/data/tools` (static, no prop needed).

**Filtering logic:** Case-insensitive match on `tool.name` or `tool.description`. Applied when `query.length > 0`.

**Dropdown behaviour:**
- Hidden when `query` is empty
- Shown when `query` has 1+ characters, anchored below the input
- Shows all matching tools; if zero matches, shows a single "No results" row
- Click outside closes the dropdown (mousedown listener on `document`)
- `Escape` clears `query` and closes dropdown
- Arrow up/down moves `highlighted`; `Enter` navigates to highlighted tool

**Navigation:** `router.push('/install/[id]')` on suggestion click or Enter. Query clears and dropdown closes after navigation.

**⌘K behaviour:** Unchanged — focuses input from anywhere and redirects to `/` first if not on home page.

**Removed:** `router.replace` URL param updates (`?q=`).

### FilterableGrid

- Remove `useSearchParams` import and `?q=` read
- Remove `matches()` helper and the `.filter(t => !q || matches(t, q))` step
- Remove `matching "${q}"` from the result count label
- Category pill filter stays exactly as-is

---

## Dropdown UI

Each suggestion row shows:
- Tool name (bold)
- Category chip (matches existing chip styles from ToolCard)

One "No results" row when query matches nothing.

Dropdown is positioned `absolute` below the input container, `z-index` above page content. Styled to match the existing card/border design tokens.

---

## Empty States

| State | Behaviour |
|---|---|
| Input empty / not focused | Dropdown hidden |
| Input focused, query empty | Dropdown hidden |
| Query has matches | Show matching tool rows |
| Query has no matches | Show "No results" row |

---

## What does NOT change

- Category filter pills in FilterableGrid — still work independently
- Mobile: SearchBar is `hidden md:inline-flex` — no mobile search (pre-existing constraint)
- `/install/[tool]` page — unchanged
- ⌘K keyboard shortcut — still focuses input

---

## Next.js 15 notes

`useRouter`, `usePathname` from `next/navigation` behave identically to v14 in client components. The async `params`/`searchParams` breaking change only affects server components and does not apply here.

---

## Files to change

| File | Change |
|---|---|
| `src/components/SearchBar.tsx` | Full rewrite — local suggestions dropdown, remove URL param logic |
| `src/components/FilterableGrid.tsx` | Remove `useSearchParams`, `matches()`, and `?q=` filter |
