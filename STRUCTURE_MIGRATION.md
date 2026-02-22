# NeoCode Project Structure Migration

This document tracks the ongoing migration of the NeoCode monorepo to a Layered Domain Architecture.

## 🏁 Phase 1: Infrastructure & Extensions (COMPLETED)

- [x] Move `extensions/*` to `apps/ext-*`
- [x] Rename `platform/` to `infrastructure/`
- [x] Update root `package.json` workspaces
- [x] Update package names in `package.json` for moved items
- [x] Standardize prefix: `app-ext-*` for extensions and `infra-*` for platform items.

## 🏃 Phase 2: App & Service Consolidation (COMPLETED)

- [x] Rename `apps/app` to `apps/web-app` (`@neocode-ai/app-web`)
- [x] Rename `apps/web` to `apps/marketing` (`@neocode-ai/app-marketing`)
- [x] Rename `apps/console` to `apps/admin-console` (`@neocode-ai/app-admin`)
- [x] Flatten `services/api/main` to `services/api` (`@neocode-ai/svc-api`)
- [x] Flatten `services/core/main` to `services/core` (`@neocode-ai/svc-core`)
- [x] Relocate `services/*/console` to sibling services (e.g., `services/api-console`)

## 🏗️ Phase 3: Logic Extraction (COMPLETED)

- [x] Extract Database schema/migrations to `packages/db` (`@neocode-ai/pkg-db`)
- [x] Extract Shared Auth logic to `packages/auth` (`@neocode-ai/pkg-auth`)
- [x] Standardize `packages/util` to `packages/utils` (`@neocode-ai/pkg-utils`)

## 🛠️ Phase 4: Tooling & DX (COMPLETED)

- [x] Standardize `tooling/` sub-packages (`@neocode-ai/tool-*`)
  - `tooling/cli` → `@neocode-ai/tool-cli`
  - `tooling/lint` → `@neocode-ai/tool-lint`
  - `tooling/scripts` → `@neocode-ai/tool-scripts`
  - `tooling/tsconfig` → `@neocode-ai/tool-tsconfig` (new)
- [x] Centralize TSConfig presets (`tooling/tsconfig`) for `base`, `bun`, `solid` variants.
- [x] Add `dependsOn: ["^typecheck"]` ordering to Turbo pipeline.

## 🔮 Phase 5: Next Steps (COMPLETED)

- [x] Migrate packages to extend `@neocode-ai/tool-tsconfig/*` instead of direct `@tsconfig/bun`
- [x] Add `@neocode-ai/tool-testing` preset (bun test config, test utilities)
- [x] Add CI pipeline validation via `bun run typecheck && bun run test:workspaces`

## 🚀 Phase 6: Platform Features & Ecosystem Expansion (COMPLETED)

- [x] Dependency Intelligence Layer (`packages/pkg-deps`) - ProtoNexus dependency resolution/SBOM
- [x] AI Automation Hooks (`packages/pkg-ai-ops`) - Arcanum integration, LLM remediation
- [x] Security Control Plane (`services/svc-security`) - SAST/DAST, policy-as-code
- [x] Observability Core (`packages/pkg-observability`) - OpenTelemetry tracing & metrics
- [x] Plugin/Extension SDK (`packages/pkg-sdk`) - Lifecycle hooks, sandbox, permissions
- [x] Release Engineering (`infrastructure/release`) - versioning, signing, SLSA
- [x] Scaffolding CLI (`tooling/create-neocode`) - Internal codebase generator
