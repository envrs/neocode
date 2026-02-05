#!/usr/bin/env bun
import { TemporalGlyphEngine } from "../src/ui/temporal-glyph.js"

function main() {
  console.clear()
  console.log("🕒 NeoCode Temporal Glyphs - Learning Trajectories")
  console.log("═".repeat(60))

  // Simulate system evolution over time
  const scenarios = [
    {
      name: "System Optimization Journey",
      description: "From unstable prototype to production-ready system",
      states: generateOptimizationJourney(),
    },
    {
      name: "Production Incident Recovery",
      description: "System degradation and recovery timeline",
      states: generateIncidentRecovery(),
    },
    {
      name: "Gradual Configuration Drift",
      description: "Slow evolution and complexity accumulation",
      states: generateConfigurationDrift(),
    },
    {
      name: "Rapid Model Upgrades",
      description: "Fast-paced AI model evolution",
      states: generateModelUpgrades(),
    },
  ]

  console.log("\n📋 Learning Scenarios:")
  console.log("─".repeat(60))

  scenarios.forEach((scenario, index) => {
    console.log(`\n${index + 1}. ${scenario.name}`)
    console.log(`   ${scenario.description}`)
  })

  // Process each scenario
  scenarios.forEach((scenario, index) => {
    console.log(`\n\n${"═".repeat(80)}`)
    console.log(`🕒 Scenario ${index + 1}: ${scenario.name}`)
    console.log(`${"═".repeat(80)}`)

    const trajectory = TemporalGlyphEngine.generateTrajectory(scenario.states)
    const render = TemporalGlyphEngine.renderTemporalEvolution(trajectory)

    render.forEach((line) => console.log(line))
  })

  console.log(`\n\n${"═".repeat(80)}`)
  console.log("📊 Comparative Analysis")
  console.log(`${"═".repeat(80)}`)

  // Generate all trajectories for comparison
  const trajectories = scenarios.map((scenario) => ({
    name: scenario.name,
    trajectory: TemporalGlyphEngine.generateTrajectory(scenario.states),
  }))

  console.log("\n🎯 Trajectory Comparison:")
  console.log("─".repeat(60))

  trajectories.forEach(({ name, trajectory }) => {
    const { trajectory: traj, insights } = trajectory
    console.log(`\n${name}:`)
    console.log(`  Trend: ${traj.trend.toUpperCase()}`)
    console.log(`  Learning Rate: ${(insights.learningRate * 100).toFixed(1)}%/period`)
    console.log(`  Convergence: ${(traj.convergence * 100).toFixed(1)}%`)
    console.log(`  Warning Points: ${insights.warningPoints.length}`)
    if (insights.optimalPoint) {
      console.log(`  Optimal Performance: ${(insights.optimalPoint.metrics.performance * 100).toFixed(1)}%`)
    }
  })

  console.log(`\n\n${"═".repeat(80)}`)
  console.log("📝 Learning Report Generation")
  console.log(`${"═".repeat(80)}`)

  // Generate detailed learning report for the most interesting scenario
  const optimizationTrajectory = TemporalGlyphEngine.generateTrajectory(scenarios[0].states)
  const report = TemporalGlyphEngine.generateLearningReport(optimizationTrajectory)

  console.log("\n📄 Generated Learning Report:")
  console.log("─".repeat(60))
  console.log(report)

  console.log(`\n\n${"═".repeat(80)}`)
  console.log("🧬 Temporal Glyph Insights")
  console.log(`${"═".repeat(80)}`)

  console.log("\n✅ Key Capabilities Demonstrated:")
  console.log("• Learning trajectory visualization over time")
  console.log("• Performance, reliability, complexity, and stability tracking")
  console.log("• Trend analysis (improving/degrading/stable/volatile)")
  console.log("• Velocity and acceleration calculations")
  console.log("• Convergence detection for system stability")
  console.log("• Optimal performance point identification")
  console.log("• Warning point detection for incidents")
  console.log("• Automated learning report generation")

  console.log("\n🎯 Advanced Use Cases:")
  console.log("• Incident time-travel - see exactly when and how systems diverged")
  console.log("• A/B testing visualization - compare optimization strategies")
  console.log("• Capacity planning - predict future system behavior")
  console.log("• Team performance metrics - track improvement over time")
  console.log("• Compliance reporting - demonstrate system stability")

  console.log("\n🔬 Scientific Principles Applied:")
  console.log("• Time series analysis for trend detection")
  console.log("• Symmetry analysis for stability assessment")
  console.log("• Rate-of-change calculations for velocity")
  console.log("• Volatility measurements for risk assessment")
  console.log("• Convergence theory for optimization tracking")

  console.log("\n🚀 Integration Opportunities:")
  console.log("• CI/CD pipelines - track deployment impact over time")
  console.log("• Monitoring systems - correlate alerts with glyph changes")
  console.log("• Performance dashboards - visual system health indicators")
  console.log("• Incident response - rapid root cause identification")
  console.log("• Executive reporting - system health at a glance")

  console.log("\n✨ Temporal Glyph Demo Complete!")
  console.log("═".repeat(60))
  console.log("\nPhilosophical Achievement:")
  console.log("The glyph now exists in 4 dimensions:")
  console.log("• Space - visual pattern and structure")
  console.log("• Time - evolution and learning trajectories")
  console.log("• State - system configuration and environment")
  console.log("• Meaning - semantic impact and risk assessment")
  console.log("\nThis creates a complete language for system observability")
  console.log("where identity, change, and judgment are unified in a single")
  console.log("perceptual object that humans and machines can understand together.")
}

// Helper functions to generate realistic scenarios
function generateOptimizationJourney() {
  const baseTime = Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago

  return [
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.9, maxTokens: 8192, debug: true },
        toolchain: ["typescript"],
        commitSha: "1111111111111111",
        environment: "development",
      },
      timestamp: baseTime,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.8, maxTokens: 6144, debug: true },
        toolchain: ["typescript", "eslint"],
        commitSha: "2222222222222222",
        environment: "development",
      },
      timestamp: baseTime + 5 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.6, maxTokens: 4096, debug: false },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "3333333333333333",
        environment: "staging",
      },
      timestamp: baseTime + 10 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.3, maxTokens: 2048, debug: false, cache: true },
        toolchain: ["typescript", "bun", "eslint", "prettier"],
        commitSha: "4444444444444444",
        environment: "staging",
      },
      timestamp: baseTime + 15 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, debug: false, cache: true },
        toolchain: ["typescript", "bun", "eslint", "prettier"],
        commitSha: "5555555555555555",
        environment: "production",
      },
      timestamp: baseTime + 20 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, debug: false, cache: true, timeout: 30000 },
        toolchain: ["typescript", "bun", "eslint", "prettier", "webpack"],
        commitSha: "6666666666666666",
        environment: "production",
      },
      timestamp: baseTime + 25 * 24 * 60 * 60 * 1000,
    },
  ]
}

function generateIncidentRecovery() {
  const baseTime = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7 days ago

  return [
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, cache: true },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "aaa111111111111",
        environment: "production",
      },
      timestamp: baseTime,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, cache: false }, // Cache disabled - incident!
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "bbb222222222222",
        environment: "production",
      },
      timestamp: baseTime + 2 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.3, maxTokens: 2048, debug: true }, // Rollback
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "ccc333333333333",
        environment: "production",
      },
      timestamp: baseTime + 3 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, cache: true }, // Recovery
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "ddd444444444444",
        environment: "production",
      },
      timestamp: baseTime + 5 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.1, maxTokens: 1024, cache: true, monitoring: true }, // Enhanced monitoring
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "eee555555555555",
        environment: "production",
      },
      timestamp: baseTime + 6 * 24 * 60 * 60 * 1000,
    },
  ]
}

function generateConfigurationDrift() {
  const baseTime = Date.now() - 60 * 24 * 60 * 60 * 1000 // 60 days ago

  return [
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ["typescript", "bun"],
        commitSha: "drift1111111111",
        environment: "production",
      },
      timestamp: baseTime,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.65, maxTokens: 3840, timeout: 30000 },
        toolchain: ["typescript", "bun"],
        commitSha: "drift2222222222",
        environment: "production",
      },
      timestamp: baseTime + 15 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.6, maxTokens: 3584, timeout: 30000, retries: 3 },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "drift3333333333",
        environment: "production",
      },
      timestamp: baseTime + 30 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.55, maxTokens: 3328, timeout: 25000, retries: 3, logging: true },
        toolchain: ["typescript", "bun", "eslint", "prettier"],
        commitSha: "drift4444444444",
        environment: "production",
      },
      timestamp: baseTime + 45 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.5, maxTokens: 3072, timeout: 25000, retries: 3, logging: true, metrics: true },
        toolchain: ["typescript", "bun", "eslint", "prettier"],
        commitSha: "drift5555555555",
        environment: "production",
      },
      timestamp: baseTime + 60 * 24 * 60 * 60 * 1000,
    },
  ]
}

function generateModelUpgrades() {
  const baseTime = Date.now() - 14 * 24 * 60 * 60 * 1000 // 14 days ago

  return [
    {
      state: {
        modelVersion: "gpt-5.1",
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ["typescript", "bun"],
        commitSha: "model1111111111",
        environment: "staging",
      },
      timestamp: baseTime,
    },
    {
      state: {
        modelVersion: "gpt-5.2",
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ["typescript", "bun"],
        commitSha: "model2222222222",
        environment: "staging",
      },
      timestamp: baseTime + 3 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo",
        config: { temperature: 0.6, maxTokens: 4096 },
        toolchain: ["typescript", "bun"],
        commitSha: "model3333333333",
        environment: "staging",
      },
      timestamp: baseTime + 6 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.5, maxTokens: 4096 },
        toolchain: ["typescript", "bun"],
        commitSha: "model4444444444",
        environment: "staging",
      },
      timestamp: baseTime + 9 * 24 * 60 * 60 * 1000,
    },
    {
      state: {
        modelVersion: "gpt-5.2-turbo-pro",
        config: { temperature: 0.3, maxTokens: 2048, cache: true },
        toolchain: ["typescript", "bun", "eslint"],
        commitSha: "model5555555555",
        environment: "production",
      },
      timestamp: baseTime + 12 * 24 * 60 * 60 * 1000,
    },
  ]
}

if (import.meta.main) {
  main()
}
