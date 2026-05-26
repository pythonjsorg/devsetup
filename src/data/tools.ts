export type OS = 'macos' | 'windows' | 'linux'

export type ToolId = 'nodejs' | 'bun' | 'uv' | 'claude-cli' | 'codex-cli'

export type InstallMethods = {
  homebrew?: string[]
  winget?: string[]
  apt?: string[]
  curl?: string[]
  manual?: string[]
}

export type Tool = {
  id: string
  name: string
  description: string
  category: 'runtime' | 'ai-tool' | 'package-manager'
  dependencies: ToolId[]
  lts: {
    version: string
    label: string
  } | null
  install: Record<OS, InstallMethods>
}

export const TOOLS = [
  {
    id: 'nodejs',
    name: 'Node.js',
    description:
      "JavaScript runtime built on Chrome's V8 engine. Required for npm, npx, and most JS-based CLI tools.",
    category: 'runtime',
    dependencies: [],
    lts: {
      version: '22.x',
      label: 'Jod',
    },
    install: {
      macos: {
        homebrew: [
          'brew install node@22',
          'echo \'export PATH="$(brew --prefix node@22)/bin:$PATH"\' >> ~/.zshrc && source ~/.zshrc',
        ],
      },
      windows: {
        winget: ['winget install OpenJS.NodeJS.LTS'],
      },
      linux: {
        // Debian/Ubuntu only via NodeSource
        apt: [
          'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -',
          'sudo apt-get install -y nodejs',
        ],
      },
    },
  },
  {
    id: 'bun',
    name: 'Bun',
    description:
      'Fast all-in-one JavaScript runtime, bundler, test runner, and package manager.',
    category: 'runtime',
    dependencies: [],
    lts: null,
    install: {
      macos: {
        homebrew: ['brew install bun'],
      },
      windows: {
        manual: ['powershell -c "irm bun.sh/install.ps1 | iex"'],
      },
      linux: {
        curl: ['curl -fsSL https://bun.sh/install | bash'],
      },
    },
  },
  {
    id: 'uv',
    name: 'uv',
    description:
      'Extremely fast Python package and project manager. Replaces pip, pip-tools, pyenv, and virtualenv.',
    category: 'package-manager',
    dependencies: [],
    lts: null,
    install: {
      macos: {
        homebrew: ['brew install uv'],
      },
      windows: {
        manual: ['powershell -c "irm https://astral.sh/uv/install.ps1 | iex"'],
      },
      linux: {
        curl: ['curl -LsSf https://astral.sh/uv/install.sh | sh'],
      },
    },
  },
  {
    id: 'claude-cli',
    name: 'Claude CLI',
    description:
      "Anthropic's Claude Code — an AI coding assistant that works in your terminal. Requires Node.js.",
    category: 'ai-tool',
    dependencies: ['nodejs'],
    lts: null,
    install: {
      macos: { manual: ['npm install -g @anthropic-ai/claude-code'] },
      windows: { manual: ['npm install -g @anthropic-ai/claude-code'] },
      linux: { manual: ['npm install -g @anthropic-ai/claude-code'] },
    },
  },
  {
    id: 'codex-cli',
    name: 'Codex CLI',
    description:
      "OpenAI's Codex — a lightweight AI coding agent that runs in your terminal. Requires Node.js.",
    category: 'ai-tool',
    dependencies: ['nodejs'],
    lts: null,
    install: {
      macos: { manual: ['npm install -g @openai/codex'] },
      windows: { manual: ['npm install -g @openai/codex'] },
      linux: { manual: ['npm install -g @openai/codex'] },
    },
  },
] as const satisfies readonly Tool[]
