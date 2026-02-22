#!/usr/bin/env bun

import { $ } from "bun"
import { fileURLToPath } from "url"

const rootDir = fileURLToPath(new URL("../..", import.meta.url))
process.chdir(rootDir)

await $`bun packages/sdk/script/build.ts`

const openapi = await $`bun dev generate`.cwd("services/core").text()
await Bun.write("specs/openapi.json", openapi)

await $`./tooling/scripts/format.ts`
