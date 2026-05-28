export type OS = 'macos' | 'windows' | 'linux'

export type ToolId = 'nodejs' | 'bun' | 'uv' | 'claude-cli' | 'codex-cli' | 'gemini-cli' | 'deno' | 'docker' | 'git'

export type InstallMethods = {
  homebrew?: string[]
  nvm?: string[]
  winget?: string[]
  apt?: string[]
  curl?: string[]
  manual?: string[]
}

export type LtsEntry = {
  version: string               // "24.x"
  major: number                 // 24
  label: string                 // "Krypton"
  eol: string                   // "2028-04-30" ISO date
  status: 'active' | 'maintenance'
  install: Record<OS, InstallMethods>
}

export type ToolTip = {
  verify: string
  hello?: { cmd: string; label: string }[]
  cliRef?: string
}

export type Tool = {
  id: string
  name: string
  description: string
  category: 'runtime' | 'ai-tool' | 'package-manager' | 'platform' | 'vcs'
  dependencies: ToolId[]
  lts: { version: string; label: string } | null
  ltsVersions: LtsEntry[]       // empty = no version picker
  install: Record<OS, InstallMethods>
  tips?: ToolTip
}

export const TOOLS = [
  {
    id: 'nodejs',
    name: 'Node.js',
    description:
      "JavaScript runtime built on Chrome's V8 engine. Required for npm, npx, and most JS-based CLI tools.",
    category: 'runtime',
    dependencies: [],
    lts: { version: '24.x', label: 'Krypton' },
    ltsVersions: [
      {
        version: '24.x',
        major: 24,
        label: 'Krypton',
        eol: '2028-04-30',
        status: 'active',
        install: {
          macos: {
            nvm: [
              'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash',
              'source ~/.nvm/nvm.sh',
              'nvm install 24',
            ],
            homebrew: [
              'brew install node@24',
              'echo \'export PATH="$(brew --prefix node@24)/bin:$PATH"\' >> ~/.zshrc && source ~/.zshrc',
            ],
          },
          windows: {
            winget: ['winget install OpenJS.NodeJS.LTS'],
          },
          linux: {
            nvm: [
              'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash',
              'source ~/.nvm/nvm.sh',
              'nvm install 24',
            ],
            apt: [
              'curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -',
              'sudo apt-get install -y nodejs',
            ],
          },
        },
      },
      {
        version: '22.x',
        major: 22,
        label: 'Jod',
        eol: '2027-04-30',
        status: 'maintenance',
        install: {
          macos: {
            nvm: [
              'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash',
              'source ~/.nvm/nvm.sh',
              'nvm install 22',
            ],
            homebrew: [
              'brew install node@22',
              'echo \'export PATH="$(brew --prefix node@22)/bin:$PATH"\' >> ~/.zshrc && source ~/.zshrc',
            ],
          },
          windows: {
            winget: ['winget install OpenJS.NodeJS.LTS'],
          },
          linux: {
            nvm: [
              'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash',
              'source ~/.nvm/nvm.sh',
              'nvm install 22',
            ],
            apt: [
              'curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -',
              'sudo apt-get install -y nodejs',
            ],
          },
        },
      },
    ],
    // default install = v24 (mirrors ltsVersions[0])
    install: {
      macos: {
        nvm: [
          'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash',
          'source ~/.nvm/nvm.sh',
          'nvm install 24',
        ],
        homebrew: [
          'brew install node@24',
          'echo \'export PATH="$(brew --prefix node@24)/bin:$PATH"\' >> ~/.zshrc && source ~/.zshrc',
        ],
      },
      windows: {
        winget: ['winget install OpenJS.NodeJS.LTS'],
      },
      linux: {
        nvm: [
          'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash',
          'source ~/.nvm/nvm.sh',
          'nvm install 24',
        ],
        apt: [
          'curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -',
          'sudo apt-get install -y nodejs',
        ],
      },
    },
    tips: {
      verify: 'node --version',
      hello: [
        { cmd: 'node -e "console.log(42)"', label: 'Run inline script' },
        { cmd: 'node server.js', label: 'Run a file' },
        { cmd: 'npm install express', label: 'Install a package' },
      ],
      cliRef: '/cli/nodejs',
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
    ltsVersions: [],
    install: {
      macos: {
        homebrew: ['brew install oven-sh/bun/bun'],
        curl: ['curl -fsSL https://bun.sh/install | bash'],
      },
      windows: {
        manual: ['powershell -c "irm bun.sh/install.ps1 | iex"'],
      },
      linux: {
        curl: ['curl -fsSL https://bun.sh/install | bash'],
      },
    },
    tips: {
      verify: 'bun --version',
      hello: [
        { cmd: 'bun add express', label: 'Install a package' },
        { cmd: 'bun run dev', label: 'Run dev script' },
        { cmd: 'bun test', label: 'Run tests' },
      ],
      cliRef: '/cli/bun',
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
    ltsVersions: [],
    install: {
      macos: {
        homebrew: ['brew install uv'],
        curl: ['curl -LsSf https://astral.sh/uv/install.sh | sh'],
      },
      windows: {
        manual: ['powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"'],
      },
      linux: {
        curl: ['curl -LsSf https://astral.sh/uv/install.sh | sh'],
      },
    },
    tips: {
      verify: 'uv --version',
      hello: [
        { cmd: 'uv init myproject', label: 'Create a project' },
        { cmd: 'uv add requests', label: 'Add a dependency' },
        { cmd: 'uv run python app.py', label: 'Run with managed env' },
      ],
      cliRef: '/cli/uv',
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
    ltsVersions: [],
    install: {
      macos: { manual: ['npm install -g @anthropic-ai/claude-code'] },
      windows: { manual: ['npm install -g @anthropic-ai/claude-code'] },
      linux: { manual: ['npm install -g @anthropic-ai/claude-code'] },
    },
    tips: {
      verify: 'claude --version',
      hello: [
        { cmd: 'claude', label: 'Start interactive session' },
        { cmd: 'claude "explain this code"', label: 'Quick question' },
      ],
      cliRef: '/cli/claude-cli',
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
    ltsVersions: [],
    install: {
      macos: { manual: ['npm install -g @openai/codex'] },
      windows: { manual: ['npm install -g @openai/codex'] },
      linux: { manual: ['npm install -g @openai/codex'] },
    },
    tips: {
      verify: 'codex --version',
      hello: [
        { cmd: 'codex', label: 'Start interactive session' },
        { cmd: 'codex "fix this bug"', label: 'Quick task' },
      ],
      cliRef: '/cli/codex-cli',
    },
  },
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
        apt: [
          'sudo apt-get update',
          'for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove -y $pkg; done',
          'sudo apt-get install -y ca-certificates curl',
          'sudo install -m 0755 -d /etc/apt/keyrings',
          'sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc',
          'sudo chmod a+r /etc/apt/keyrings/docker.asc',
          'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null',
          'sudo apt-get update',
          'sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin',
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
] as const satisfies readonly Tool[]
