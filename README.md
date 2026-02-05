<p align="center">
  <a href="https://neo.khulnasoft.com">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="NeoCode logo" width="400">
    </picture>
  </a>
</p>

<p align="center">
  <strong>The open-source AI coding agent built for the modern terminal.</strong>
</p>

<p align="center">
  <a href="https://neo.khulnasoft.com/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord&color=5865F2" /></a>
  <a href="https://www.npmjs.com/package/neocode-ai"><img alt="npm" src="https://img.shields.io/npm/v/neocode-ai?style=flat-square&color=CB3837" /></a>
  <a href="https://github.com/neopilot-ai/neocode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/neopilot-ai/neocode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

---

NeoCode is a powerful, provider-agnostic AI coding agent designed to live in your terminal. It's built for speed, transparency, and deep integration with your development workflow.

### ✨ Key Features

- 🛠️ **Deep LSP Integration**: Understands your code like your editor does.
- 🌐 **Provider Agnostic**: Use Claude, OpenAI, Gemini, or local models via Ollama.
- 🚄 **Terminal First**: Optimized for Neovim users and TUI enthusiasts.
- 🏗️ **Client/Server Architecture**: Run the heavy lifting on a server, drive it from anywhere.
- 🛡️ **100% Open Source**: Transparent, hackable, and community-driven.

---

### 🚀 Quick Start

Get up and running in seconds.

#### One-liner (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/refs/heads/dev/install | bash
```

#### Package Managers

| Platform / Tool | Command                                |
| :-------------- | :------------------------------------- |
| **npm**         | `npm i -g neocode-ai@latest`           |
| **Homebrew**    | `brew install neopilot-ai/tap/neocode` |
| **Scoop**       | `scoop install neocode`                |
| **Nix**         | `nix run nixpkgs#neocode`              |

> [!TIP]
> If you're upgrading from a version older than `0.1.x`, we recommend removing the old version first.

---

### 🖥️ Desktop App (BETA)

Prefer a windowed experience? The NeoCode Desktop app is available for all major platforms.

[**Download Latest Release**](https://github.com/neopilot-ai/neocode/releases)

- **macOS**: `brew install --cask neocode-desktop`
- **Windows**: `scoop bucket add extras; scoop install extras/neocode-desktop`
- **Linux**: Available as `.deb`, `.rpm`, or AppImage.

---

### 🤖 Intelligent Agents

Toggle between specialized agents using the `Tab` key to match your current task.

- **`build`** (Default): Full-access agent capable of editing files, running tests, and managing your project.
- **`plan`**: Read-only mode for exploration and analysis. It won't touch your files without explicit permission.
- **`@general`**: A background subagent for multi-step research and complex search tasks.

[Learn more about Agents →](https://neo.khulnasoft.com/docs/agents)

---

### ❓ FAQ

#### How is this different from Claude Code?

NeoCode shares similar DNA but doubles down on developer freedom:

- **No Lock-in**: We don't force a single provider. Use what works best for you.
- **Built-in LSP**: Better context awareness out of the box.
- **TUI Focused**: Built by the creators of [terminal.shop](https://terminal.shop), we push the limits of the terminal interface.
- **Extensible**: Designed from the ground up to be part of a larger ecosystem.

---

### 📝 Notes & Advanced Config

<details>
<summary><b>Installation Directory</b></summary>

The install script respects the following priority:

1. `$NEOCODE_INSTALL_DIR`
2. `$XDG_BIN_DIR`
3. `$HOME/bin`
4. `$HOME/.neocode/bin` (Default fallback)

Example:

```bash
NEOCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/refs/heads/dev/install | bash
```

</details>

<details>
<summary><b>Building on NeoCode (Naming Policy)</b></summary>

If you are working on a project related to NeoCode and use "neocode" in its name (e.g., "neocode-dashboard"), please clarify in your README that it is not built by or affiliated with the official NeoCode team.

</details>

---

### 🤝 Contributing & Community

We love contributors! Please read our [Contributing Guide](./CONTRIBUTING.md) before getting started.

- 💬 **Discord**: [Join our community](https://discord.gg/neocode)
- 🐦 **X (Twitter)**: [Follow @neocode](https://x.com/neocode)
- 📖 **Documentation**: [Full Docs](https://neo.khulnasoft.com/docs)

---

<p align="center">
  Built with ❤️ by the NeoCode Team and community.
</p>
