#!/usr/bin/env bun
import { SystemGlyph } from "../src/ui/system-glyph.js"

function main() {
  console.clear()
  console.log("🔬 NeoCode System Glyph - Advanced Fingerprinting")
  console.log("═".repeat(60))

  // Define different system states
  const environments = [
    {
      name: "Development",
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.7, maxTokens: 4096, debug: true },
        toolchain: ["typescript", "bun", "eslint", "prettier"],
        commitSha: "a1b2c3d4e5f6789",
        environment: "development",
      },
    },
    {
      name: "Staging",
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.3, maxTokens: 2048, debug: false },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "f6e5d4c3b2a1987",
        environment: "staging",
      },
    },
    {
      name: "Production",
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, debug: false, cache: true },
        toolchain: ["typescript", "bun", "eslint", "prettier", "webpack"],
        commitSha: "9f8e7d6c5b4a321",
        environment: "production",
      },
    },
  ]

  console.log("\n🏷️  Environment Fingerprints:")
  console.log("─".repeat(60))

  const fingerprints = environments.map(({ name, state }) => {
    const glyph = new SystemGlyph(state)
    const fingerprint = glyph.generateFingerprint()

    console.log(`\n${name}:`)
    console.log(`  Signature: ${fingerprint.signature}`)
    console.log(`  Seed: ${fingerprint.seed}`)
    console.log(`  Hash: ${fingerprint.metadata.stateHash.slice(0, 16)}...`)
    console.log("  Glyph:")
    fingerprint.glyph.forEach((line) => console.log(`    ${line}`))

    return fingerprint
  })

  console.log("\n🔍 Environment Comparison:")
  console.log("─".repeat(60))

  // Compare environments
  for (let i = 0; i < environments.length; i++) {
    for (let j = i + 1; j < environments.length; j++) {
      const env1 = environments[i]
      const env2 = environments[j]

      const comparison = SystemGlyph.compareStates(env1.state, env2.state)

      console.log(`\n${env1.name} ↔ ${env2.name}:`)
      console.log(`  Similarity: ${(comparison.similarity * 100).toFixed(1)}%`)
      console.log(`  Compatibility: ${comparison.compatibility}`)
      if (comparison.differences.length > 0) {
        console.log(`  Differences: ${comparison.differences.join(", ")}`)
      }
    }
  }

  console.log("\n🏥 Diagnostic Glyphs:")
  console.log("─".repeat(60))

  // Show diagnostic glyphs for different health states
  const healthStates = [
    {
      name: "Optimal System",
      health: { errors: 0, warnings: 0, performance: 0.95, reliability: 0.98 },
    },
    {
      name: "Degraded System",
      health: { errors: 2, warnings: 5, performance: 0.7, reliability: 0.8 },
    },
    {
      name: "Learning System",
      health: { errors: 0, warnings: 3, performance: 0.85, reliability: 0.9 },
    },
  ]

  healthStates.forEach(({ name, health }) => {
    const glyph = new SystemGlyph(environments[2].state) // Use production state
    const diagnostic = glyph.generateDiagnosticGlyph(health)

    console.log(`\n${name}:`)
    diagnostic.forEach((line) => console.log(`  ${line}`))
  })

  console.log("\n🚀 CI/PR Signatures:")
  console.log("─".repeat(60))

  // Show CI signatures for different run metrics
  const ciRuns = [
    {
      name: "Excellent Run",
      metrics: { totalRuns: 42, successRate: 1.0, avgLatency: 0.15, errorRate: 0.0 },
    },
    {
      name: "Good Run",
      metrics: { totalRuns: 28, successRate: 0.96, avgLatency: 0.22, errorRate: 0.02 },
    },
    {
      name: "Problematic Run",
      metrics: { totalRuns: 15, successRate: 0.87, avgLatency: 0.45, errorRate: 0.08 },
    },
  ]

  ciRuns.forEach(({ name, metrics }) => {
    const glyph = new SystemGlyph(environments[2].state)
    const signature = glyph.generateCISignature(metrics)

    console.log(`\n${name}:`)
    signature.split("\n").forEach((line) => console.log(`  ${line}`))
  })

  console.log("\n🎯 Progressive Disclosure Demo:")
  console.log("─".repeat(60))

  // Show how the same system can be displayed at different verbosity levels
  const productionGlyph = new SystemGlyph(environments[2].state)

  console.log("\nLevel 1 - Casual (glyph only):")
  productionGlyph.generateCoreGlyph().forEach((line) => console.log(`  ${line}`))

  console.log("\nLevel 2 - Status (glyph + signature):")
  const fingerprint = productionGlyph.generateFingerprint()
  productionGlyph.generateCoreGlyph().forEach((line) => console.log(`  ${line}`))
  console.log(`  ${fingerprint.signature}`)

  console.log("\nLevel 3 - Diagnostics (full system state):")
  productionGlyph.generateCoreGlyph().forEach((line) => console.log(`  ${line}`))
  console.log(`  ${fingerprint.signature}`)
  console.log(`  Model: ${environments[2].state.modelVersion}`)
  console.log(`  Environment: ${environments[2].state.environment}`)
  console.log(`  Toolchain: ${environments[2].state.toolchain.join(", ")}`)
  console.log(`  Config: ${Object.keys(environments[2].state.config).length} parameters`)

  console.log("\n🧬 System State Evolution:")
  console.log("─".repeat(60))

  // Show how the glyph evolves with system changes
  const evolutionSteps = [
    {
      name: "Initial State",
      state: {
        ...environments[0].state,
        commitSha: "0000000000000000",
      },
    },
    {
      name: "After Config Change",
      state: {
        ...environments[0].state,
        config: { ...environments[0].state.config, temperature: 0.5 },
        commitSha: "1111111111111111",
      },
    },
    {
      name: "After Model Upgrade",
      state: {
        ...environments[1].state,
        modelVersion: "gpt-5.2-turbo-pro",
        commitSha: "2222222222222222",
      },
    },
  ]

  evolutionSteps.forEach(({ name, state }, index) => {
    const glyph = new SystemGlyph(state)
    const fingerprint = glyph.generateFingerprint()

    console.log(`\nStep ${index + 1}: ${name}`)
    glyph.generateCoreGlyph().forEach((line) => console.log(`  ${line}`))
    console.log(`  Seed: ${fingerprint.seed} | Changes detected`)
  })

  console.log("\n✨ System Glyph Advanced Demo Complete!")
  console.log("═".repeat(60))
  console.log("\nKey Insights:")
  console.log("• Each environment has a unique but recognizable identity")
  console.log("• System changes are visually fingerprintable")
  console.log("• Health status affects glyph symmetry and density")
  console.log("• CI signatures provide mathematical trust signals")
  console.log("• Progressive disclosure serves different user needs")
}

if (import.meta.main) {
  main()
}
