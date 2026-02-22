import { resolveGraph, type DependencyNode } from "./graph"
import { detectConflicts, type VersionConflict } from "./conflicts"
import { generateSBOM, type SBOMFormat } from "./sbom"

export { resolveGraph } from "./graph"
export type { DependencyNode } from "./graph"

export { detectConflicts } from "./conflicts"
export type { VersionConflict } from "./conflicts"

export { generateSBOM } from "./sbom"
export type { SBOMFormat } from "./sbom"

/**
 * Dependency Intelligence Layer (ProtoNexus)
 * Analyzes and resolves workspace dependencies
 */
export const ProtoNexus = {
    resolveGraph,
    detectConflicts,
    generateSBOM,
}
