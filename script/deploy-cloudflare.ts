#!/usr/bin/env bun

import { $ } from "bun"
import { Script } from "@neocode-ai/script"

console.log("=== Deploying to Cloudflare Workers ===\n")

const stage = process.env.STAGE || "dev"
console.log(`Deploying to stage: ${stage}`)

// Deploy web documentation
console.log("\n=== Deploying Web Documentation ===")
await $`cd packages/web && bun run build`
await $`cd packages/web && bunx wrangler deploy --env ${stage}`

// Deploy console app
console.log("\n=== Deploying Console App ===")
await $`cd packages/console/app && bun run build`
await $`cd packages/console/app && bunx wrangler deploy --env ${stage}`

console.log(`\n✅ Deployment complete for ${stage}.neo.khulnasoft.com`)

if (stage === "production") {
  console.log("🌐 Production deployment complete: https://neo.khulnasoft.com")
} else {
  console.log(`🌐 Staging deployment complete: https://${stage}.neo.khulnasoft.com`)
}
