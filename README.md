<div align="center">

![neocode logo](https://raw.githubusercontent.com/neopilot-ai/neocode/dev/packages/web/src/assets/logo-ornate-light.svg#gh-dark-mode-only)
![neocode logo](https://raw.githubusercontent.com/neopilot-ai/neocode/dev/packages/web/src/assets/logo-ornate-dark.svg#gh-light-mode-only)

# 🤖 neocode

**AI coding agent, built for the terminal**

[![npm version](https://img.shields.io/npm/v/neocode-ai?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/neocode-ai)
[![Build Status](https://img.shields.io/github/actions/workflow/status/neopilot-ai/neocode/publish.yml?style=for-the-badge&branch=dev&logo=github)](https://github.com/neopilot-ai/neocode/actions/workflows/publish.yml)

</div>

---

## 🚀 Quick Start

### One-Command Installation

```bash
curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/dev/install | bash
```

### Package Managers

| Package          | Command                             |
| ---------------- | ----------------------------------- |
| **npm**          | `npm i -g neocode-ai@latest`        |
| **bun**          | `bun add -g neocode-ai@latest`      |
| **pnpm**         | `pnpm add -g neocode-ai@latest`     |
| **yarn**         | `yarn global add neocode-ai@latest` |
| **brew** (macOS) | `brew install sst/tap/neocode`      |
| **paru** (Arch)  | `paru -S neocode-bin`               |

> 💡 **Tip**: Remove versions older than 0.1.x before installing

---

## 📁 Installation Directory

The install script follows this priority order:

| Priority | Environment Variable  | Description                       |
| -------- | --------------------- | --------------------------------- |
| 1️⃣       | `NEOCODE_INSTALL_DIR` | Custom installation directory     |
| 2️⃣       | `XDG_BIN_DIR`         | XDG Base Directory compliant path |
| 3️⃣       | `HOME/bin`            | Standard user binary directory    |
| 4️⃣       | `HOME/.neocode/bin`   | Default fallback                  |

### Examples

```bash
# Custom directory
NEOCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/dev/install | bash

# XDG compliant
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://raw.githubusercontent.com/neopilot-ai/neocode/dev/install | bash
```

---

## 📚 Documentation

👉 **[Complete Documentation](https://neo.khulnasoft.com/docs)**

---

## 🤝 Contributing

### 🎯 What We Accept

- ✅ **Bug fixes**
- ✅ **LLM performance improvements**
- ✅ **New provider support**
- ✅ **Environment-specific fixes**
- ✅ **Standard behavior implementations**
- ✅ **Documentation improvements**

### ⚠️ What We Don't Accept

- ❌ **Core feature PRs** (requires design process with core team)

> 🚨 **Important**: We do not accept PRs for fundamental features. Please check our git history to see what kind of PRs we typically merge.

### 🛠️ Local Development

**Prerequisites:**

- **Bun** (JavaScript runtime)
- **Golang 1.24.x** (for the Go client)

**Setup:**

```bash
$ bun install
$ bun run packages/neocode/src/index.ts
```

#### 🔧 Development Notes

**API Client**: After modifying TypeScript API endpoints in `packages/neocode/src/server/server.ts`, the neocode team needs to generate a new stainless SDK for clients.

---

## ❓ FAQ

### 🆚 How is this different from Claude Code?

| Feature              | neocode                             | Claude Code        |
| -------------------- | ----------------------------------- | ------------------ |
| **Open Source**      | ✅ 100% open source                 | ❌ Proprietary     |
| **Provider Support** | ✅ Anthropic, OpenAI, Google, Local | ❌ Anthropic only  |
| **Architecture**     | ✅ Client/Server (multi-client)     | ❌ Single client   |
| **Terminal Focus**   | ✅ Built by terminal enthusiasts    | ❌ General purpose |
| **Mobile Support**   | ✅ Via client/server architecture   | ❌ No              |

### 📦 What's the other repo?

The confusingly named repository has no relation to this one. [Read the story here](https://x.com/thdxr/status/1933561254481666466).

---

<div align="center">

**Built with ❤️ by the neopilot team**

</div>
