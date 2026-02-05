<p align="center">
  <a href="https://neo.khulnasoft.com">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="NeoCode logo">
    </picture>
  </a>
</p>
<p align="center">The open source AI coding agent.</p>
<p align="center">
  <a href="https://neo.khulnasoft.com/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/neocode-ai"><img alt="npm" src="https://img.shields.io/npm/v/neocode-ai?style=flat-square" /></a>
  <a href="https://github.com/neopilot-ai/neocode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/neopilot-ai/neocode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a>
</p>

[![NeoCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://neo.khulnasoft.com)

---

### Installation

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/refs/heads/dev/install | bash

# Package managers
npm i -g neocode-ai@latest        # or bun/pnpm/yarn
scoop install neocode             # Windows
choco install neocode             # Windows
brew install neopilot-ai/tap/neocode # macOS and Linux (recommended, always up to date)
brew install neocode              # macOS and Linux (official brew formula, updated less)
paru -S neocode-bin               # Arch Linux
mise use -g neocode               # Any OS
nix run nixpkgs#neocode           # or github:neopilot-ai/neocode for latest dev branch
```

> [!TIP]
> Remove versions older than 0.1.x before installing.

### Desktop App (BETA)

NeoCode is also available as a desktop application. Download directly from the [releases page](https://github.com/neopilot-ai/neocode/releases) or [neo.khulnasoft.com/download](https://neo.khulnasoft.com/download).

| Platform              | Download                             |
| --------------------- | ------------------------------------ |
| macOS (Apple Silicon) | `neocode-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `neocode-desktop-darwin-x64.dmg`     |
| Windows               | `neocode-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm`, or AppImage          |

```bash
# macOS (Homebrew)
brew install --cask neocode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/neocode-desktop
```

#### Installation Directory

The install script respects the following priority order for the installation path:

1. `$NEOCODE_INSTALL_DIR` - Custom installation directory
2. `$XDG_BIN_DIR` - XDG Base Directory Specification compliant path
3. `$HOME/bin` - Standard user binary directory (if exists or can be created)
4. `$HOME/.neocode/bin` - Default fallback

```bash
# Examples
NEOCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/refs/heads/dev/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/refs/heads/dev/install | bash
```

### Agents

NeoCode includes two built-in agents you can switch between with the `Tab` key.

- **build** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also, included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

Learn more about [agents](https://neo.khulnasoft.com/docs/agents).

### Documentation

For more info on how to configure NeoCode [**head over to our docs**](https://neo.khulnasoft.com/docs).

### Contributing

If you're interested in contributing to NeoCode, please read our [contributing docs](./CONTRIBUTING.md) before submitting a pull request.

### Building on NeoCode

If you are working on a project that's related to NeoCode and is using "neocode" as a part of its name; for example, "neocode-dashboard" or "neocode-mobile", please add a note to your README to clarify that it is not built by the NeoCode team and is not affiliated with us in any way.

### FAQ

#### How is this different from Claude Code?

It's very similar to Claude Code in terms of capability. Here are the key differences:

- 100% open source
- Not coupled to any provider. Although we recommend the models we provide through [NeoCode Zen](https://neo.khulnasoft.com/zen); NeoCode can be used with Claude, OpenAI, Google or even local models. As models evolve the gaps between them will close and pricing will drop so being provider-agnostic is important.
- Out of the box LSP support
- A focus on TUI. NeoCode is built by neovim users and the creators of [terminal.shop](https://terminal.shop); we are going to push the limits of what's possible in the terminal.
- A client/server architecture. This for example can allow NeoCode to run on your computer, while you can drive it remotely from a mobile app. Meaning that the TUI frontend is just one of the possible clients.

---

**Join our community** [Discord](https://discord.gg/neocode) | [X.com](https://x.com/neocode)
