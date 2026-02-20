function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

export namespace Flag {
  export const NEOCODE_AUTO_SHARE = truthy("NEOCODE_AUTO_SHARE")
  export const NEOCODE_GIT_BASH_PATH = process.env["NEOCODE_GIT_BASH_PATH"]
  export const NEOCODE_CONFIG = process.env["NEOCODE_CONFIG"]
  export declare const NEOCODE_CONFIG_DIR: string | undefined
  export const NEOCODE_CONFIG_CONTENT = process.env["NEOCODE_CONFIG_CONTENT"]
  export const NEOCODE_DISABLE_AUTOUPDATE = truthy("NEOCODE_DISABLE_AUTOUPDATE")
  export const NEOCODE_DISABLE_PRUNE = truthy("NEOCODE_DISABLE_PRUNE")
  export const NEOCODE_DISABLE_TERMINAL_TITLE = truthy("NEOCODE_DISABLE_TERMINAL_TITLE")
  export const NEOCODE_PERMISSION = process.env["NEOCODE_PERMISSION"]
  export const NEOCODE_DISABLE_DEFAULT_PLUGINS = truthy("NEOCODE_DISABLE_DEFAULT_PLUGINS")
  export const NEOCODE_DISABLE_LSP_DOWNLOAD = truthy("NEOCODE_DISABLE_LSP_DOWNLOAD")
  export const NEOCODE_ENABLE_EXPERIMENTAL_MODELS = truthy("NEOCODE_ENABLE_EXPERIMENTAL_MODELS")
  export const NEOCODE_DISABLE_AUTOCOMPACT = truthy("NEOCODE_DISABLE_AUTOCOMPACT")
  export const NEOCODE_DISABLE_MODELS_FETCH = truthy("NEOCODE_DISABLE_MODELS_FETCH")
  export const NEOCODE_DISABLE_CLAUDE_CODE = truthy("NEOCODE_DISABLE_CLAUDE_CODE")
  export const NEOCODE_DISABLE_CLAUDE_CODE_PROMPT =
    NEOCODE_DISABLE_CLAUDE_CODE || truthy("NEOCODE_DISABLE_CLAUDE_CODE_PROMPT")
  export const NEOCODE_DISABLE_CLAUDE_CODE_SKILLS =
    NEOCODE_DISABLE_CLAUDE_CODE || truthy("NEOCODE_DISABLE_CLAUDE_CODE_SKILLS")
  export const NEOCODE_DISABLE_EXTERNAL_SKILLS =
    NEOCODE_DISABLE_CLAUDE_CODE_SKILLS || truthy("NEOCODE_DISABLE_EXTERNAL_SKILLS")
  export declare const NEOCODE_DISABLE_PROJECT_CONFIG: boolean
  export const NEOCODE_FAKE_VCS = process.env["NEOCODE_FAKE_VCS"]
  export declare const NEOCODE_CLIENT: string
  export const NEOCODE_SERVER_PASSWORD = process.env["NEOCODE_SERVER_PASSWORD"]
  export const NEOCODE_SERVER_USERNAME = process.env["NEOCODE_SERVER_USERNAME"]
  export const NEOCODE_ENABLE_QUESTION_TOOL = truthy("NEOCODE_ENABLE_QUESTION_TOOL")

  // Experimental
  export const NEOCODE_EXPERIMENTAL = truthy("NEOCODE_EXPERIMENTAL")
  export const NEOCODE_EXPERIMENTAL_FILEWATCHER = truthy("NEOCODE_EXPERIMENTAL_FILEWATCHER")
  export const NEOCODE_EXPERIMENTAL_DISABLE_FILEWATCHER = truthy("NEOCODE_EXPERIMENTAL_DISABLE_FILEWATCHER")
  export const NEOCODE_EXPERIMENTAL_ICON_DISCOVERY =
    NEOCODE_EXPERIMENTAL || truthy("NEOCODE_EXPERIMENTAL_ICON_DISCOVERY")

  const copy = process.env["NEOCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
  export const NEOCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT =
    copy === undefined ? process.platform === "win32" : truthy("NEOCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  export const NEOCODE_ENABLE_EXA =
    truthy("NEOCODE_ENABLE_EXA") || NEOCODE_EXPERIMENTAL || truthy("NEOCODE_EXPERIMENTAL_EXA")
  export const NEOCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS = number("NEOCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS")
  export const NEOCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX = number("NEOCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX")
  export const NEOCODE_EXPERIMENTAL_OXFMT = NEOCODE_EXPERIMENTAL || truthy("NEOCODE_EXPERIMENTAL_OXFMT")
  export const NEOCODE_EXPERIMENTAL_LSP_TY = truthy("NEOCODE_EXPERIMENTAL_LSP_TY")
  export const NEOCODE_EXPERIMENTAL_LSP_TOOL = NEOCODE_EXPERIMENTAL || truthy("NEOCODE_EXPERIMENTAL_LSP_TOOL")
  export const NEOCODE_DISABLE_FILETIME_CHECK = truthy("NEOCODE_DISABLE_FILETIME_CHECK")
  export const NEOCODE_EXPERIMENTAL_PLAN_MODE = NEOCODE_EXPERIMENTAL || truthy("NEOCODE_EXPERIMENTAL_PLAN_MODE")
  export const NEOCODE_EXPERIMENTAL_MARKDOWN = truthy("NEOCODE_EXPERIMENTAL_MARKDOWN")
  export const NEOCODE_MODELS_URL = process.env["NEOCODE_MODELS_URL"]
  export const NEOCODE_MODELS_PATH = process.env["NEOCODE_MODELS_PATH"]

  function number(key: string) {
    const value = process.env[key]
    if (!value) return undefined
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }
}

// Dynamic getter for NEOCODE_DISABLE_PROJECT_CONFIG
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "NEOCODE_DISABLE_PROJECT_CONFIG", {
  get() {
    return truthy("NEOCODE_DISABLE_PROJECT_CONFIG")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for NEOCODE_CONFIG_DIR
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "NEOCODE_CONFIG_DIR", {
  get() {
    return process.env["NEOCODE_CONFIG_DIR"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for NEOCODE_CLIENT
// This must be evaluated at access time, not module load time,
// because some commands override the client at runtime
Object.defineProperty(Flag, "NEOCODE_CLIENT", {
  get() {
    return process.env["NEOCODE_CLIENT"] ?? "cli"
  },
  enumerable: true,
  configurable: false,
})
