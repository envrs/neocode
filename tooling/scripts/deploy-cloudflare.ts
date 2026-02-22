#!/usr/bin/env bun

import { $ } from "bun"

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
await $`cd apps/web && bun run build`
await $`cd apps/web && bunx wrangler deploy --env ${stage}`

// Deploy console app (Nitro redirected config — patch wrangler.json, no --env)
console.log("\n=== Deploying Console App ===")
await $`cd apps/console && bun run build`

// Patch the generated wrangler.json with env-specific settings
const wranglerJsonPath = "apps/console/.output/server/wrangler.json"
const generated = JSON.parse(await Bun.file(wranglerJsonPath).text())
const envCfg = CONSOLE_ENV[stage] ?? CONSOLE_ENV["dev"]!
const patched = {
  ...generated,
  name: envCfg.name,
  routes: envCfg.routes,
  kv_namespaces: envCfg.kv_namespaces,
}
await Bun.write(wranglerJsonPath, JSON.stringify(patched, null, 2))
console.log(`Patched ${wranglerJsonPath} for stage: ${stage}`)

await $`cd apps/console && bunx wrangler deploy`

console.log(`\n✅ Deployment complete for ${stage}.neo.khulnasoft.com`)

if (stage === "production") {
  console.log("🌐 Production deployment complete: https://neo.khulnasoft.com")
} else {
  console.log(`🌐 Staging deployment complete: https://${stage}.neo.khulnasoft.com`)
}
