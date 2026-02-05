#!/usr/bin/env bun
import { GlyphDiffEngine } from "../src/ui/glyph-diff.js"

function main() {
  console.clear()
  console.log("🔍 NeoCode Glyph Diff - Visual State Comparison")
  console.log("═".repeat(60))

  // Define scenarios for diffing
  const scenarios = [
    {
      name: "Staging → Production Deployment",
      description: "Typical deployment scenario with minimal changes",
      fromState: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.3, maxTokens: 2048, debug: false },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "f6e5d4c3b2a1987",
        environment: "staging",
      },
      toState: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.1, maxTokens: 1024, debug: false },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "9f8e7d6c5b4a321",
        environment: "production",
      },
    },
    {
      name: "Model Upgrade Scenario",
      description: "Major model version upgrade with config changes",
      fromState: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.7, maxTokens: 4096, debug: true },
        toolchain: ["typescript", "bun"],
        commitSha: "a1b2c3d4e5f6789",
        environment: "development",
      },
      toState: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.5, maxTokens: 2048, debug: false, cache: true },
        toolchain: ["typescript", "bun", "prettier"],
        commitSha: "b2c3d4e5f6789a1",
        environment: "development",
      },
    },
    {
      name: "Critical Production Incident",
      description: "Emergency rollback scenario",
      fromState: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, debug: false, cache: true },
        toolchain: ["typescript", "bun", "eslint", "prettier", "webpack"],
        commitSha: "9f8e7d6c5b4a321",
        environment: "production",
      },
      toState: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.3, maxTokens: 2048, debug: false },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "f6e5d4c3b2a1987",
        environment: "production",
      },
    },
    {
      name: "Configuration Drift",
      description: "Slow config changes over time",
      fromState: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ["typescript", "bun"],
        commitSha: "1111111111111111",
        environment: "development",
      },
      toState: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.65, maxTokens: 3840, timeout: 30000 },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "2222222222222222",
        environment: "development",
      },
    },
  ]

  console.log("\n📋 Diff Scenarios:")
  console.log("─".repeat(60))

  scenarios.forEach((scenario, index) => {
    console.log(`\n${index + 1}. ${scenario.name}`)
    console.log(`   ${scenario.description}`)
  })

  // Process each scenario
  scenarios.forEach((scenario, index) => {
    console.log(`\n\n${"═".repeat(80)}`)
    console.log(`🔍 Scenario ${index + 1}: ${scenario.name}`)
    console.log(`${"═".repeat(80)}`)

    const diff = GlyphDiffEngine.computeDiff(scenario.fromState, scenario.toState)
    const render = GlyphDiffEngine.renderDiff(diff)

    render.forEach((line) => console.log(line))
  })

  console.log(`\n\n${"═".repeat(80)}`)
  console.log("🚀 CI/PR Integration Demo")
  console.log(`${"═".repeat(80)}`)

  // Show CI comment generation
  const deploymentDiff = GlyphDiffEngine.computeDiff(scenarios[0].fromState, scenarios[0].toState)

  const ciComment = GlyphDiffEngine.generateCIComment(deploymentDiff)

  console.log("\n📝 Generated CI Comment:")
  console.log("─".repeat(40))
  console.log(ciComment)

  console.log(`\n\n${"═".repeat(80)}`)
  console.log("📊 Diff Analysis Summary")
  console.log(`${"═".repeat(80)}`)

  // Show summary statistics
  const diffs = scenarios.map((scenario) => GlyphDiffEngine.computeDiff(scenario.fromState, scenario.toState))

  console.log("\n🎯 Impact Distribution:")
  const impactCounts = diffs.reduce(
    (acc, diff) => {
      acc[diff.interpretation.impact] = (acc[diff.interpretation.impact] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  Object.entries(impactCounts).forEach(([impact, count]) => {
    console.log(`  ${impact.toUpperCase()}: ${count} scenario(s)`)
  })

  console.log("\n⚠️  Risk Distribution:")
  const riskCounts = diffs.reduce(
    (acc, diff) => {
      acc[diff.interpretation.risk] = (acc[diff.interpretation.risk] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  Object.entries(riskCounts).forEach(([risk, count]) => {
    console.log(`  ${risk.toUpperCase()}: ${count} scenario(s)`)
  })

  console.log("\n📈 Similarity Range:")
  const similarities = diffs.map((diff) => diff.similarity)
  const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length
  const minSimilarity = Math.min(...similarities)
  const maxSimilarity = Math.max(...similarities)

  console.log(`  Average: ${(avgSimilarity * 100).toFixed(1)}%`)
  console.log(`  Range: ${(minSimilarity * 100).toFixed(1)}% - ${(maxSimilarity * 100).toFixed(1)}%`)

  console.log("\n🔍 Structural vs Semantic Analysis:")
  diffs.forEach((diff, index) => {
    const structural = diff.differences.structural
    const semanticCount = diff.differences.semantic.length
    const confidence = diff.differences.confidence

    console.log(`  ${scenarios[index].name}:`)
    console.log(
      `    Structural: ${(structural * 100).toFixed(1)}% | Semantic: ${semanticCount} changes | Confidence: ${(confidence * 100).toFixed(1)}%`,
    )
  })

  console.log(`\n\n${"═".repeat(80)}`)
  console.log("🧬 Use Cases Demonstrated")
  console.log(`${"═".repeat(80)}`)

  console.log("\n✅ Deployment Validation:")
  console.log("  • Visual confirmation of environment changes")
  console.log("  • Risk assessment before production deployment")
  console.log("  • Automated rollback recommendations")

  console.log("\n✅ Incident Response:")
  console.log("  • Quick identification of what changed")
  console.log("  • Visual diff for rapid root cause analysis")
  console.log("  • Confidence metrics for decision making")

  console.log("\n✅ Configuration Drift Detection:")
  console.log("  • Subtle changes become visually obvious")
  console.log("  • Quantified impact assessment")
  console.log("  • Automated compliance checking")

  console.log("\n✅ CI/PR Integration:")
  console.log("  • Mathematical trust signals in merge requests")
  console.log("  • Automated deployment gates")
  console.log("  • Team-wide visual language for changes")

  console.log("\n✨ Glyph Diff Demo Complete!")
  console.log("═".repeat(60))
  console.log("\nKey Insights:")
  console.log("• Visual diffs make state changes immediately obvious")
  console.log("• Structural and semantic analysis provide complementary insights")
  console.log("• Risk assessment enables automated deployment decisions")
  console.log("• CI integration creates mathematical trust in deployments")
  console.log("• Configuration drift becomes visually detectable")
}

if (import.meta.main) {
  main()
}
