#!/usr/bin/env bun

import { $ } from "bun"

await $`bun ../../packages/sdk-js/script/build.ts`

await $`bun dev generate > ../../specs/openapi.json`.cwd("../../services/core/main")

await $`./format.ts`
