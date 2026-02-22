import type { DependencyNode } from "./graph"

export type SBOMFormat = "CycloneDX" | "SPDX" | "JSON"

export interface SBOMGeneratorOptions {
    format: SBOMFormat
    version?: string
    author?: string
}

/**
 * Exports the dependency graph into a recognized Software Bill of Materials.
 */
export function generateSBOM(graph: DependencyNode[], options: SBOMGeneratorOptions): string {
    if (options.format === "JSON") {
        // Generate a simple JSON structured manifest
        return JSON.stringify(
            {
                manifest_version: options.version || "1.0.0",
                author: options.author || "neocode",
                generatedAt: new Date().toISOString(),
                nodes: graph,
            },
            null,
            2,
        )
    }

    if (options.format === "CycloneDX") {
        // Scaffold CycloneDX layout
        return JSON.stringify(
            {
                bomFormat: "CycloneDX",
                specVersion: "1.5",
                serialNumber: "urn:uuid:" + crypto.randomUUID(),
                version: 1,
                metadata: {
                    timestamp: new Date().toISOString(),
                    tools: [
                        {
                            vendor: "neocode",
                            name: "ProtoNexus Analyzer",
                            version: "1.0.0",
                        },
                    ],
                },
                components: graph.map((node) => ({
                    type: node.isWorkspace ? "library" : "unknown",
                    name: node.name,
                    version: node.version,
                    purl: `pkg:npm/${node.name}@${node.version}`,
                })),
            },
            null,
            2,
        )
    }

    // Simplified SPDX stub
    let spdx = "SPDXVersion: SPDX-2.3\n"
    spdx += "DataLicense: CC0-1.0\n"
    spdx += "SPDXID: SPDXRef-DOCUMENT\n"
    spdx += `DocumentName: NeoCode-${options.version || "SBOM"}\n`
    spdx += `DocumentNamespace: https://neocode.ai/sbom-${crypto.randomUUID()}\n`
    spdx += "Creator: Tool: ProtoNexus Analyzer\n"
    spdx += `Created: ${new Date().toISOString()}\n\n`

    for (const node of graph) {
        spdx += `PackageName: ${node.name}\n`
        spdx += `SPDXID: SPDXRef-Package-${node.name.replace(/[^a-zA-Z0-9-]/g, "-")}\n`
        spdx += `PackageVersion: ${node.version}\n`
        spdx += `PackageDownloadLocation: NOASSERTION\n`
        spdx += `FilesAnalyzed: false\n`
        spdx += `PackageLicenseDeclared: NOASSERTION\n`
        spdx += `PackageLicenseConcluded: NOASSERTION\n\n`
    }

    return spdx
}
