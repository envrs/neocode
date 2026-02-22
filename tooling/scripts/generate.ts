#!/usr/bin/env bun

import { $ } from "bun"
import { fileURLToPath } from "url"

const rootDir = fileURLToPath(new URL("../..", import.meta.url))
process.chdir(rootDir)

await $`bun packages/sdk-js/script/build.ts`

await $`bun dev generate > specs/openapi.json`.cwd("services/core/main")

await $`./tooling/scripts/format.ts`
