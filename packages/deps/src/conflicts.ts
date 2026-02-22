import semver from "semver"
import type { DependencyNode } from "./graph"

export interface VersionConflict {
    name: string
    versionA: string
    versionB: string
    sourceA: string
    sourceB: string
}

/**
 * Validates dependencies across a set of nodes to find semantic versioning conflicts.
 */
export function detectConflicts(nodes: DependencyNode[]): VersionConflict[] {
    const versions: Record<string, { version: string; source: string }[]> = {}

    // Aggregate versions
    for (const node of nodes) {
        const allDeps = {
            ...node.dependencies,
            ...node.devDependencies,
            ...node.peerDependencies,
        }

        for (const [name, version] of Object.entries(allDeps)) {
            if (!versions[name]) versions[name] = []
            versions[name].push({ version, source: node.name })
        }
    }

    const conflicts: VersionConflict[] = []

    // Check for incompatibilities
    for (const [name, declared] of Object.entries(versions)) {
        if (declared.length < 2) continue

        // A very naive conflict detection (e.g. checking for overlapping ranges using semver)
        // In a real implementation this would evaluate the intersection of version constraints.
        const refs = declared.sort((a, b) => a.source.localeCompare(b.source))
        for (let i = 0; i < refs.length - 1; i++) {
            for (let j = i + 1; j < refs.length; j++) {
                const refI = refs[i]!
                const refJ = refs[j]!
                // If versions differ exactly and neither is a workspace catalog/asterisk reference
                if (
                    refI.version !== refJ.version &&
                    refI.version !== "catalog:" &&
                    refI.version !== "workspace:*" &&
                    refJ.version !== "catalog:" &&
                    refJ.version !== "workspace:*"
                ) {
                    // If the ranges don't intersect, it's a conflict
                    if (!semver.intersects(refI.version, refJ.version)) {
                        conflicts.push({
                            name,
                            versionA: refI.version,
                            sourceA: refI.source,
                            versionB: refJ.version,
                            sourceB: refJ.source,
                        })
                    }
                }
            }
        }
    }

    // Deduplicate conflicts
    const deduped: VersionConflict[] = []
    const seen = new Set<string>()

    for (const conflict of conflicts) {
        const key = `${conflict.name}|${conflict.versionA}|${conflict.sourceA}|${conflict.versionB}|${conflict.sourceB}`
        if (!seen.has(key)) {
            seen.add(key)
            deduped.push(conflict)
        }
    }

    return deduped
}
