/**
 * Zen Gateway Configuration
 * Centralized configuration management with validation
 */

export interface ZenConfig {
  freeWorkspaces: string[]
  maxRetries: number
  requestTimeout: number
  maxBodySize: number
  maxBufferSize: number
  maxChunkSize: number
  enableDebugLogging: boolean
}

/**
 * Load and validate Zen configuration from environment variables
 */
export function loadZenConfig(): ZenConfig {
  const config: ZenConfig = {
    freeWorkspaces: parseFreeWorkspaces(process.env.ZEN_FREE_WORKSPACES),
    maxRetries: parseNumber(process.env.ZEN_MAX_RETRIES, 3, 1, 10),
    requestTimeout: parseNumber(process.env.ZEN_REQUEST_TIMEOUT, 30000, 5000, 300000),
    maxBodySize: parseNumber(process.env.ZEN_MAX_BODY_SIZE, 10 * 1024 * 1024, 1024, 100 * 1024 * 1024),
    maxBufferSize: parseNumber(process.env.ZEN_MAX_BUFFER_SIZE, 1024 * 1024, 1024, 10 * 1024 * 1024),
    maxChunkSize: parseNumber(process.env.ZEN_MAX_CHUNK_SIZE, 64 * 1024, 1024, 1024 * 1024),
    enableDebugLogging: parseBoolean(process.env.ZEN_DEBUG_LOGGING, false),
  }

  validateConfig(config)
  return config
}

function parseFreeWorkspaces(envValue: string | undefined): string[] {
  if (!envValue) return []

  return envValue
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0)
    .filter((id) => /^wrk_[a-zA-Z0-9]+$/.test(id))
}

function parseNumber(envValue: string | undefined, defaultValue: number, min: number, max: number): number {
  if (!envValue) return defaultValue

  const parsed = parseInt(envValue, 10)
  if (isNaN(parsed) || parsed < min || parsed > max) {
    throw new Error(`Invalid number value: ${envValue}. Must be between ${min} and ${max}`)
  }

  return parsed
}

function parseBoolean(envValue: string | undefined, defaultValue: boolean): boolean {
  if (!envValue) return defaultValue

  const lower = envValue.toLowerCase()
  if (["true", "1", "yes", "on"].includes(lower)) return true
  if (["false", "0", "no", "off"].includes(lower)) return false

  throw new Error(`Invalid boolean value: ${envValue}. Must be true/false, 1/0, yes/no, or on/off`)
}

function validateConfig(config: ZenConfig): void {
  if (config.maxRetries < 1 || config.maxRetries > 10) {
    throw new Error("ZEN_MAX_RETRIES must be between 1 and 10")
  }

  if (config.maxBodySize < 1024 || config.maxBodySize > 100 * 1024 * 1024) {
    throw new Error("ZEN_MAX_BODY_SIZE must be between 1KB and 100MB")
  }

  if (config.requestTimeout < 5000 || config.requestTimeout > 300000) {
    throw new Error("ZEN_REQUEST_TIMEOUT must be between 5s and 5min")
  }
}

/**
 * Export singleton configuration instance
 */
export const zenConfig = loadZenConfig()
