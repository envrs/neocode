#!/usr/bin/env bun

import { $ } from "bun"
import { fileURLToPath } from "url"
import fs from "node:fs/promises"

const rootDir = fileURLToPath(new URL("../..", import.meta.url))
process.chdir(rootDir)

console.log("=== Deploying to Cloudflare Workers ===\n")

const stage = process.env.STAGE || "dev"
console.log(`Deploying to stage: ${stage}`)

// ── Console app environment config ──────────────────────────────────────────
// Nitro's cloudflare_module preset generates a redirected wrangler.json which
// cannot include [env.X] sections. We patch the generated file after build.
const CONSOLE_ENV: Record<
  string,
  {
    name: string
    routes: { pattern: string; zone_name: string }[]
    kv_namespaces: { binding: string; id: string }[]
  }
> = {
  production: {
    name: "neocode-console-prod",
    routes: [{ pattern: "neo.khulnasoft.com/*", zone_name: "khulnasoft.com" }],
    kv_namespaces: [
      { binding: "SESSIONS", id: "d20ff02478d64d99848e7100af98f52f" },
      { binding: "CACHE", id: "bd44a1cb139a478b9045b0ccad16e40e" },
    ],
  },
  dev: {
    name: "neocode-console-dev",
    routes: [{ pattern: "dev.neo.khulnasoft.com/*", zone_name: "khulnasoft.com" }],
    kv_namespaces: [
      { binding: "SESSIONS", id: "d20ff02478d64d99848e7100af98f52f" },
      { binding: "CACHE", id: "bd44a1cb139a478b9045b0ccad16e40e" },
    ],
  },
  staging: {
    name: "neocode-console-staging",
    routes: [{ pattern: "staging.neo.khulnasoft.com/*", zone_name: "khulnasoft.com" }],
    kv_namespaces: [],
  },
}

// Deploy web documentation (plain wrangler.toml with environments — use --env)
console.log("\n=== Deploying Web Documentation ===")
await $`cd apps/marketing && bun run build`
await $`cd apps/marketing && bunx wrangler deploy --env ${stage}`

// Deploy console app (Nitro redirected config — patch wrangler.json, no --env)
console.log("\n=== Deploying Console App ===")
await $`cd apps/admin-console && bun run build`

// For the console, we need a special dance since Astro doesn't support custom output names for wrangler.json
const wranglerJsonPath = "apps/admin-console/.output/server/wrangler.json"
const originalWranglerJson = await fs.readFile(wranglerJsonPath, "utf-8")
const wranglerConfig = JSON.parse(originalWranglerJson)
wranglerConfig.name = CONSOLE_ENV[stage]?.name || CONSOLE_ENV["dev"]!.name // Use env-specific name
wranglerConfig.routes = CONSOLE_ENV[stage]?.routes || CONSOLE_ENV["dev"]!.routes // Use env-specific routes
wranglerConfig.kv_namespaces = CONSOLE_ENV[stage]?.kv_namespaces || CONSOLE_ENV["dev"]!.kv_namespaces // Use env-specific kv_namespaces
await fs.writeFile(wranglerJsonPath, JSON.stringify(wranglerConfig, null, 2))
console.log(`Patched ${wranglerJsonPath} for stage: ${stage}`)

await $`cd apps/admin-console && bunx wrangler deploy`

console.log(`\n✅ Deployment complete for ${stage}.neo.khulnasoft.com`)

if (stage === "production") {
  console.log("🌐 Production deployment complete: https://neo.khulnasoft.com")
} else {
  console.log(`🌐 Staging deployment complete: https://${stage}.neo.khulnasoft.com`)
}
