#!/usr/bin/env bun

import { $ } from "bun"
import { fileURLToPath } from "url"

const rootDir = fileURLToPath(new URL("../..", import.meta.url))
process.chdir(rootDir)

await $`bun packages/sdk-js/script/build.ts`

const openapi = await $`bun dev generate`.cwd("services/core/main").text()
await Bun.write("specs/openapi.json", openapi)

await $`./tooling/scripts/format.ts`
