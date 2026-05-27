# Install Guides v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 new tools (Gemini CLI, Deno, Docker, Git), rename `/install/[tool]` → `/tools/[tool]`, add per-tool "Get started" tips section, and add flat tab nav with DB/CLI/Compare stubs for future sections.

**Architecture:** All changes follow the existing pattern — `src/data/tools.ts` is the single source of truth; `src/lib/catalog.ts` feeds server components; client components handle OS/method selection. The new `tips` field on `Tool` is optional so existing tools silently render nothing until data is added. New categories (`platform`, `vcs`) follow the exact same CAT map pattern already used by `runtime`, `ai-tool`, and `package-manager`.

**Tech Stack:** Next.js 15 App Router, `output: 'export'` (fully static), TypeScript 5, Tailwind CSS v4. No test runner — use `npx tsc --noEmit` for type checks, `npm run build` for full integration.

---

## File Map

| File | Change |
|---|---|
| `src/components/Icon.tsx` | Add `layers`, `git-branch` to IconName + PATHS |
| `src/app/globals.css` | Add `--cat-platform-*` / `--cat-vcs-*` vars to all 3 themes |
| `src/data/tools.ts` | Extend ToolId, add ToolTip type, extend Tool type, add 4 new tools + tips for all 9 |
| `src/components/ToolCard.tsx` | Add platform/vcs to CAT; update href to `/tools/` |
| `src/components/InstallGuide.tsx` | Add platform/vcs to cat maps; update breadcrumb; add tips section |
| `src/app/tools/[tool]/page.tsx` | New file (moved from `install/`) — content unchanged |
| `src/app/install/[tool]/page.tsx` | Delete |
| `src/app/layout.tsx` | Add flat section tab nav; move Changelog to footer; update footer copy |
| `src/app/page.tsx` | Update "LTS-pinned" stat label |
| `vercel.json` | Add `/install/:tool` → `/tools/:tool` permanent redirect |

---

### Task 1: Add icons for platform and vcs categories

**Files:**
- Modify: `src/components/Icon.tsx`

- [ ] **Step 1: Add `layers` and `git-branch` to IconName union**

In `src/components/Icon.tsx`, update the `IconName` type:

```tsx
export type IconName =
  | 'sparkles' | 'package' | 'bolt' | 'arrow' | 'check' | 'copy'
  | 'terminal' | 'monitor' | 'apple' | 'windows' | 'search'
  | 'layers' | 'git-branch'
```

- [ ] **Step 2: Add icon paths to PATHS map**

In the `PATHS` object, after the `search:` entry, add:

```tsx
  layers: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" />
      <path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" />
    </>
  ),
  'git-branch': (
    <>
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </>
  ),
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Icon.tsx
git commit -m "feat: add layers and git-branch icons for platform/vcs categories"
```

---

### Task 2: Add CSS variables for platform and vcs categories

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add vars to paper theme**

In `src/app/globals.css`, inside `:root, [data-theme="paper"]`, after the `--cat-pkg-bg/fg` line (line 55), add:

```css
  --cat-platform-bg: #c8d8ea; --cat-platform-fg: #1a4a7a;
  --cat-vcs-bg:      #f0cfc0; --cat-vcs-fg:      #8a2c14;
```

- [ ] **Step 2: Add vars to carbon theme**

Inside `[data-theme="carbon"]`, after `--cat-pkg-bg/fg` (line 112), add:

```css
  --cat-platform-bg: #0e2035; --cat-platform-fg: #5bc0f8;
  --cat-vcs-bg:      #2a1008; --cat-vcs-fg:      #ff8855;
```

- [ ] **Step 3: Add vars to cobalt theme**

Inside `[data-theme="cobalt"]`, after `--cat-pkg-bg/fg` (line 162), add:

```css
  --cat-platform-bg: #d8eeff; --cat-platform-fg: #1d5c9e;
  --cat-vcs-bg:      #ffe0d8; --cat-vcs-fg:      #c44020;
```

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add platform and vcs category colour tokens to all themes"
```

---

### Task 3: Extend Tool type — ToolId, ToolTip, category union

**Files:**
- Modify: `src/data/tools.ts`

- [ ] **Step 1: Update ToolId union**

In `src/data/tools.ts`, update `ToolId`:

```typescript
export type ToolId = 'nodejs' | 'bun' | 'uv' | 'claude-cli' | 'codex-cli' | 'gemini-cli' | 'deno' | 'docker' | 'git'
```

- [ ] **Step 2: Add ToolTip type (after LtsEntry, before Tool)**

```typescript
export type ToolTip = {
  verify: string
  hello?: { cmd: string; label: string }[]
  cliRef?: string
}
```

- [ ] **Step 3: Update Tool type**

```typescript
export type Tool = {
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

- [ ] **Step 4: Type-check — expect errors in ToolCard and InstallGuide**

```bash
npx tsc --noEmit
```

Expected: TypeScript errors in `ToolCard.tsx` and `InstallGuide.tsx` because their `Record<Tool['category'], ...>` maps don't cover `'platform'` and `'vcs'` yet. Those are fixed in Tasks 4 and 5.

- [ ] **Step 5: Commit**

```bash
git add src/data/tools.ts
git commit -m "feat: extend Tool type — platform/vcs categories, ToolTip field, expand ToolId"
```

---

### Task 4: Update ToolCard for new categories

**Files:**
- Modify: `src/components/ToolCard.tsx`

- [ ] **Step 1: Extend CAT map with platform and vcs**

In `src/components/ToolCard.tsx`, replace the `CAT` constant with:

```tsx
const CAT: Record<
  Tool['category'],
  { label: string; icon: IconName; bg: string; fg: string }
> = {
  runtime: {
    label: 'Runtime',
    icon: 'bolt',
    bg: 'var(--cat-runtime-bg)',
    fg: 'var(--cat-runtime-fg)',
  },
  'ai-tool': {
    label: 'AI agent',
    icon: 'sparkles',
    bg: 'var(--cat-ai-bg)',
    fg: 'var(--cat-ai-fg)',
  },
  'package-manager': {
    label: 'Pkg manager',
    icon: 'package',
    bg: 'var(--cat-pkg-bg)',
    fg: 'var(--cat-pkg-fg)',
  },
  platform: {
    label: 'Platform',
    icon: 'layers',
    bg: 'var(--cat-platform-bg)',
    fg: 'var(--cat-platform-fg)',
  },
  vcs: {
    label: 'VCS',
    icon: 'git-branch',
    bg: 'var(--cat-vcs-bg)',
    fg: 'var(--cat-vcs-fg)',
  },
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: ToolCard errors gone; InstallGuide errors remain.

- [ ] **Step 3: Commit**

```bash
git add src/components/ToolCard.tsx
git commit -m "feat: add platform and vcs entries to ToolCard CAT map"
```

---

### Task 5: Update InstallGuide — new categories + tips section

**Files:**
- Modify: `src/components/InstallGuide.tsx`

- [ ] **Step 1: Extend all four category maps**

In `src/components/InstallGuide.tsx`, update the four maps inside the component body:

```tsx
const catLabel: Record<Tool['category'], string> = {
  runtime: 'Runtime',
  'ai-tool': 'AI agent',
  'package-manager': 'Pkg manager',
  platform: 'Platform',
  vcs: 'VCS',
}
const catBg: Record<Tool['category'], string> = {
  runtime: 'var(--cat-runtime-bg)',
  'ai-tool': 'var(--cat-ai-bg)',
  'package-manager': 'var(--cat-pkg-bg)',
  platform: 'var(--cat-platform-bg)',
  vcs: 'var(--cat-vcs-bg)',
}
const catFg: Record<Tool['category'], string> = {
  runtime: 'var(--cat-runtime-fg)',
  'ai-tool': 'var(--cat-ai-fg)',
  'package-manager': 'var(--cat-pkg-fg)',
  platform: 'var(--cat-platform-fg)',
  vcs: 'var(--cat-vcs-fg)',
}
const catIcon = {
  runtime: 'bolt',
  'ai-tool': 'sparkles',
  'package-manager': 'package',
  platform: 'layers',
  vcs: 'git-branch',
} as const
```

- [ ] **Step 2: Type-check — expect clean**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Add tips section after the closing `</section>` of the steps area**

In `src/components/InstallGuide.tsx`, after the `</section>` that closes the steps + success banner block (around line 610), add:

```tsx
      {/* ── Get started (tips) ──────────────────────────── */}
      {mainTool.tips && (
        <section className="mx-auto w-full max-w-3xl px-6 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="whitespace-nowrap"
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--primary)',
                fontFamily: 'var(--font-jetbrains)',
              }}
            >
              Get started
            </span>
            <div
              className="flex-1"
              style={{ height: 1, background: 'var(--border-soft)' }}
            />
          </div>

          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-2xl)',
              padding: '20px 24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p
              className="mb-3"
              style={{
                fontSize: 12,
                fontFamily: 'var(--font-jetbrains)',
                color: 'var(--muted-foreground)',
                letterSpacing: '0.04em',
              }}
            >
              Verify your install:
            </p>
            <CommandBlock commands={[mainTool.tips.verify]} />

            {mainTool.tips.hello && mainTool.tips.hello.length > 0 && (
              <div className="mt-5 flex flex-col gap-2.5">
                {mainTool.tips.hello.map(h => (
                  <div key={h.cmd} className="flex items-center gap-3 flex-wrap">
                    <code
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 12,
                        color: 'var(--foreground)',
                        background: 'var(--muted)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-sm)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h.cmd}
                    </code>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--muted-foreground)',
                        fontFamily: 'var(--font-jetbrains)',
                      }}
                    >
                      {h.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {mainTool.tips.cliRef && (
              <p
                className="mt-4"
                style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-jetbrains)',
                  color: 'var(--muted-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Full CLI reference
                <Icon name="arrow" size={11} strokeWidth={2} />
                <span style={{ opacity: 0.45 }}>coming soon</span>
              </p>
            )}
          </div>
        </section>
      )}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/InstallGuide.tsx
git commit -m "feat: add platform/vcs to InstallGuide category maps and add Get Started tips section"
```

---

### Task 6: Rename route /install/[tool] → /tools/[tool]

**Files:**
- Create: `src/app/tools/[tool]/page.tsx`
- Delete: `src/app/install/[tool]/page.tsx`
- Modify: `src/components/ToolCard.tsx`
- Modify: `src/components/InstallGuide.tsx`
- Create: `vercel.json`

- [ ] **Step 1: Copy the page to the new route**

```bash
mkdir -p "src/app/tools/[tool]"
cp "src/app/install/[tool]/page.tsx" "src/app/tools/[tool]/page.tsx"
```

The content of `src/app/tools/[tool]/page.tsx` is identical to the install page — no edits needed inside the file.

- [ ] **Step 2: Delete the old route directory**

```bash
rm -rf "src/app/install"
```

- [ ] **Step 3: Update ToolCard href**

In `src/components/ToolCard.tsx`, find the `Link` component and change the href:

```tsx
// Before:
href={`/install/${tool.id}`}

// After:
href={`/tools/${tool.id}`}
```

- [ ] **Step 4: Update InstallGuide breadcrumb label**

In `src/components/InstallGuide.tsx`, find the middle breadcrumb link (the one that says `install`) and change its text to `tools`:

```tsx
// Before:
>
  install
</Link>

// After:
>
  tools
</Link>
```

- [ ] **Step 5: Grep for remaining /install/ references**

```bash
grep -rn "/install/" src/ --include="*.tsx" --include="*.ts"
```

Update any remaining hits. The `SearchBar.tsx` component may contain tool links — check it and update any `/install/` hrefs to `/tools/`.

- [ ] **Step 6: Create vercel.json**

`next.config.ts` redirects are not applied in static exports (`output: 'export'`). Use `vercel.json` instead, which Vercel processes at the CDN edge:

```json
{
  "redirects": [
    {
      "source": "/install/:tool",
      "destination": "/tools/:tool",
      "permanent": true
    }
  ]
}
```

- [ ] **Step 7: Build to confirm**

```bash
npm run build
```

Expected: clean build. Confirm:
```bash
ls out/tools/
# should list: bun  claude-cli  codex-cli  nodejs  uv
ls out/install/ 2>&1
# should print: No such file or directory (or similar)
```

- [ ] **Step 8: Commit**

```bash
git add "src/app/tools" "src/components/ToolCard.tsx" "src/components/InstallGuide.tsx" vercel.json
git rm -r "src/app/install"
git commit -m "feat: rename route /install/[tool] → /tools/[tool] and add vercel.json redirect"
```

---

### Task 7: Add 4 new tools + tips data for all tools

**Files:**
- Modify: `src/data/tools.ts`

- [ ] **Step 1: Add tips to existing nodejs entry**

Inside the `nodejs` object in TOOLS, after the `install:` block:

```typescript
    tips: {
      verify: 'node --version',
      hello: [
        { cmd: 'node -e "console.log(42)"', label: 'Run inline script' },
        { cmd: 'node server.js', label: 'Run a file' },
        { cmd: 'npm install express', label: 'Install a package' },
      ],
      cliRef: '/cli/nodejs',
    },
```

- [ ] **Step 2: Add tips to existing bun entry**

```typescript
    tips: {
      verify: 'bun --version',
      hello: [
        { cmd: 'bun add express', label: 'Install a package' },
        { cmd: 'bun run dev', label: 'Run dev script' },
        { cmd: 'bun test', label: 'Run tests' },
      ],
      cliRef: '/cli/bun',
    },
```

- [ ] **Step 3: Add tips to existing uv entry**

```typescript
    tips: {
      verify: 'uv --version',
      hello: [
        { cmd: 'uv init myproject', label: 'Create a project' },
        { cmd: 'uv add requests', label: 'Add a dependency' },
        { cmd: 'uv run python app.py', label: 'Run with managed env' },
      ],
      cliRef: '/cli/uv',
    },
```

- [ ] **Step 4: Add tips to existing claude-cli entry**

```typescript
    tips: {
      verify: 'claude --version',
      hello: [
        { cmd: 'claude', label: 'Start interactive session' },
        { cmd: 'claude "explain this code"', label: 'Quick question' },
      ],
      cliRef: '/cli/claude-cli',
    },
```

- [ ] **Step 5: Add tips to existing codex-cli entry**

```typescript
    tips: {
      verify: 'codex --version',
      hello: [
        { cmd: 'codex', label: 'Start interactive session' },
        { cmd: 'codex "fix this bug"', label: 'Quick task' },
      ],
      cliRef: '/cli/codex-cli',
    },
```

- [ ] **Step 6: Append Gemini CLI to TOOLS array**

After the codex-cli entry, add:

```typescript
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    description:
      "Google's Gemini Code Assist — an AI coding agent that works in your terminal. Requires Node.js.",
    category: 'ai-tool',
    dependencies: ['nodejs'],
    lts: null,
    ltsVersions: [],
    install: {
      macos: { manual: ['npm install -g @google/gemini-cli'] },
      windows: { manual: ['npm install -g @google/gemini-cli'] },
      linux: { manual: ['npm install -g @google/gemini-cli'] },
    },
    tips: {
      verify: 'gemini --version',
      hello: [
        { cmd: 'gemini', label: 'Start interactive session' },
        { cmd: 'gemini "explain this file"', label: 'Quick question' },
      ],
      cliRef: '/cli/gemini-cli',
    },
  },
```

- [ ] **Step 7: Append Deno**

```typescript
  {
    id: 'deno',
    name: 'Deno',
    description:
      'Secure JavaScript and TypeScript runtime. Batteries included — no node_modules, no package.json required.',
    category: 'runtime',
    dependencies: [],
    lts: null,
    ltsVersions: [],
    install: {
      macos: {
        homebrew: ['brew install deno'],
        curl: ['curl -fsSL https://deno.land/install.sh | sh'],
      },
      windows: {
        winget: ['winget install DenoLand.Deno'],
      },
      linux: {
        curl: ['curl -fsSL https://deno.land/install.sh | sh'],
      },
    },
    tips: {
      verify: 'deno --version',
      hello: [
        { cmd: 'deno run main.ts', label: 'Run a script' },
        { cmd: 'deno add npm:express', label: 'Add a package' },
        { cmd: 'deno test', label: 'Run tests' },
      ],
      cliRef: '/cli/deno',
    },
  },
```

- [ ] **Step 8: Append Docker**

```typescript
  {
    id: 'docker',
    name: 'Docker',
    description:
      'Container platform for building, shipping, and running applications in isolated environments.',
    category: 'platform',
    dependencies: [],
    lts: null,
    ltsVersions: [],
    install: {
      macos: {
        homebrew: ['brew install --cask docker'],
      },
      windows: {
        winget: ['winget install Docker.DockerDesktop'],
      },
      linux: {
        curl: [
          'curl -fsSL https://get.docker.com | sh',
          'sudo usermod -aG docker $USER',
          'newgrp docker',
        ],
      },
    },
    tips: {
      verify: 'docker --version',
      hello: [
        { cmd: 'docker run hello-world', label: 'Test installation' },
        { cmd: 'docker ps', label: 'List running containers' },
        { cmd: 'docker compose up', label: 'Start services' },
      ],
      cliRef: '/cli/docker',
    },
  },
```

- [ ] **Step 9: Append Git**

```typescript
  {
    id: 'git',
    name: 'Git',
    description:
      'Distributed version control system. The foundation of almost every modern development workflow.',
    category: 'vcs',
    dependencies: [],
    lts: null,
    ltsVersions: [],
    install: {
      macos: {
        homebrew: ['brew install git'],
      },
      windows: {
        winget: ['winget install Git.Git'],
      },
      linux: {
        apt: ['sudo apt-get update', 'sudo apt-get install -y git'],
      },
    },
    tips: {
      verify: 'git --version',
      hello: [
        { cmd: 'git init', label: 'Initialize a repo' },
        { cmd: 'git clone <url>', label: 'Clone a repo' },
        { cmd: 'git config --global user.email "you@example.com"', label: 'Set your email' },
      ],
      cliRef: '/cli/git',
    },
  },
```

- [ ] **Step 10: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add src/data/tools.ts
git commit -m "feat: add Gemini CLI, Deno, Docker, Git and tips data for all 9 tools"
```

---

### Task 8: Add flat section tab nav and update footer

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace the header nav with section tabs**

In `src/app/layout.tsx`, replace the entire `<nav className="flex gap-5 items-center">...</nav>` block with:

```tsx
<nav className="flex items-center">
  {/* Install — active */}
  <Link
    href="/"
    className="hidden sm:inline-flex items-center whitespace-nowrap"
    style={{
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-jetbrains)',
      color: 'var(--foreground)',
      background: 'var(--muted)',
      padding: '5px 12px',
      borderRadius: 'var(--radius-full)',
      textDecoration: 'none',
    }}
  >
    Install
  </Link>

  {/* DB Commands — soon */}
  <span
    className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap"
    style={{
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-jetbrains)',
      color: 'var(--muted-foreground)',
      padding: '5px 12px',
      opacity: 0.55,
      cursor: 'default',
    }}
  >
    DB Cmds
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--muted-foreground)',
        background: 'var(--muted)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-full)',
      }}
    >
      soon
    </span>
  </span>

  {/* CLI Ref — soon */}
  <span
    className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap"
    style={{
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-jetbrains)',
      color: 'var(--muted-foreground)',
      padding: '5px 12px',
      opacity: 0.55,
      cursor: 'default',
    }}
  >
    CLI Ref
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--muted-foreground)',
        background: 'var(--muted)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-full)',
      }}
    >
      soon
    </span>
  </span>

  {/* Compare — soon */}
  <span
    className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap"
    style={{
      fontSize: 13,
      fontWeight: 600,
      fontFamily: 'var(--font-jetbrains)',
      color: 'var(--muted-foreground)',
      padding: '5px 12px',
      opacity: 0.55,
      cursor: 'default',
    }}
  >
    Compare
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--muted-foreground)',
        background: 'var(--muted)',
        padding: '2px 6px',
        borderRadius: 'var(--radius-full)',
      }}
    >
      soon
    </span>
  </span>

  <ThemeSwitcher />
  <SearchBar />
</nav>
```

- [ ] **Step 2: Update footer — move Changelog link, update copy**

Replace the existing `<footer>` block with:

```tsx
<footer style={{ borderTop: '1px solid var(--border-soft)' }}>
  <div
    className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between flex-wrap gap-3"
  >
    <span
      className="text-xs"
      style={{
        fontFamily: 'var(--font-jetbrains)',
        color: 'var(--muted-foreground)',
      }}
    >
      LTS where applicable · Dependencies resolved automatically
    </span>
    <div className="flex items-center gap-4">
      <Link
        href="/changelog"
        className="text-xs"
        style={{
          fontFamily: 'var(--font-jetbrains)',
          color: 'var(--muted-foreground)',
          textDecoration: 'none',
        }}
      >
        Changelog
      </Link>
      <span
        className="text-xs"
        style={{
          fontFamily: 'var(--font-jetbrains)',
          color: 'var(--muted-foreground)',
        }}
      >
        DevSetup
      </span>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add flat section tab nav (Install active, DB/CLI/Compare soon), move Changelog to footer"
```

---

### Task 9: Update homepage stat copy

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update stat label**

In `src/app/page.tsx`, find the stats array (around line 146) and update:

```tsx
// Before:
{ v: '100%', l: 'LTS-pinned' },

// After:
{ v: '100%', l: 'LTS where applicable' },
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "fix: update LTS stat copy to account for non-LTS tools (Docker, Git)"
```

---

### Task 10: Full build and smoke test

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors, no missing page errors.

- [ ] **Step 2: Verify tool pages were generated**

```bash
ls out/tools/
```

Expected output (9 directories):
```
bun  claude-cli  codex-cli  deno  docker  gemini-cli  git  nodejs  uv
```

- [ ] **Step 3: Verify old route is gone**

```bash
ls out/install/ 2>&1
```

Expected: `ls: out/install/: No such file or directory`

- [ ] **Step 4: Smoke test in dev server**

```bash
npm run dev
```

Open http://localhost:3000 and verify:
- Home page shows 9 tool cards (including Docker, Git, Deno, Gemini CLI with correct category badges)
- Header nav shows: `Install` (highlighted) · `DB Cmds soon` · `CLI Ref soon` · `Compare soon`
- Clicking any tool card navigates to `/tools/<id>` (check address bar)
- A tool page shows the "Get started" section with verify command + hello commands below the success banner
- Changelog link has moved to the footer
- Footer reads "LTS where applicable · Dependencies resolved automatically"
- Stat strip on homepage reads "LTS where applicable"

- [ ] **Step 5: Commit any fixes found during smoke test**

```bash
# Only if you made changes
git add -p
git commit -m "fix: <describe what you caught>"
```
