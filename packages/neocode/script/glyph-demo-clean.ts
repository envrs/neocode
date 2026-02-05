#!/usr/bin/env bun
import { LivingGlyph } from '../src/ui/glyph.js'

function main() {
  console.clear()
  console.log('🧬 NeoCode Living Glyph Demo')
  console.log('═'.repeat(50))
  
  // Create glyph instance
  const glyph = new LivingGlyph({
    size: 7,
    density: 0.8,
    symmetry: true,
    seed: 42
  })
  
  // Demo metrics
  const metrics = {
    performance: {
      latency: 0.21,
      throughput: 1000,
      load: 0.3
    },
    evolution: {
      generation: 128,
      accuracy: 0.95,
      variance: 0.05,
      entropy: 0.7
    },
    confidence: {
      probability: 0.991,
      errorNorm: 0.017,
      confidence: 0.98
    }
  }
  
  // Generate and display startup splash
  console.log('\n🚀 Startup Splash:')
  console.log('─'.repeat(50))
  const splash = glyph.generateStartupSplash(metrics)
  splash.forEach(line => console.log(line))
  
  console.log('\n🎯 Core Glyph Variations:')
  console.log('─'.repeat(50))
  
  // Demo different glyph configurations
  const configs = [
    { size: 5, density: 0.7, symmetry: true, label: 'AI' },
    { size: 7, density: 0.6, symmetry: true, label: 'CODE' },
    { size: 9, density: 0.8, symmetry: true, label: 'NEOCODE' }
  ]
  
  configs.forEach((config, i) => {
    console.log(`\n${i + 1}. Size ${config.size}x${config.size} ("${config.label}"):`)
    const g = new LivingGlyph({ size: config.size, density: config.density, symmetry: config.symmetry })
    g.generateCoreGlyph(config.label).forEach(line => console.log(`   ${line}`))
  })
  
  console.log('\n⚡ Performance Visualization:')
  console.log('─'.repeat(50))
  
  const latencies = [0.05, 0.15, 0.25, 0.50, 1.0]
  latencies.forEach(latency => {
    const wave = glyph.generatePerformanceWave({ latency, throughput: 1000, load: 0.3 }, 12)
    console.log(`  ${latency.toFixed(2)}ms: ${wave}`)
  })
  
  console.log('\n🧬 Evolution & Learning:')
  console.log('─'.repeat(50))
  
  const evolutionStates = [
    { generation: 0, entropy: 1.0, label: 'High uncertainty (start)' },
    { generation: 50, entropy: 0.7, label: 'Converging' },
    { generation: 100, entropy: 0.4, label: 'Learning' },
    { generation: 200, entropy: 0.1, label: 'Optimized' }
  ]
  
  evolutionStates.forEach(state => {
    const signal = glyph.generateEvolutionSignal({
      generation: state.generation,
      accuracy: 0.5 + (state.generation / 400),
      variance: 1.0 - (state.generation / 200),
      entropy: state.entropy
    })
    console.log(`  Gen ${state.generation.toString().padStart(3)}: ${signal.padEnd(25)} ${state.label}`)
  })
  
  console.log('\n🎯 Confidence Metrics:')
  console.log('─'.repeat(50))
  
  const confidenceLevels = [0.5, 0.7, 0.85, 0.95, 0.99]
  confidenceLevels.forEach(prob => {
    const confidence = glyph.generateConfidenceBar({
      probability: prob,
      errorNorm: 1.0 - prob,
      confidence: prob
    })
    console.log(`  P=${prob.toFixed(2)}:`)
    confidence.forEach(line => console.log(`    ${line}`))
    console.log()
  })
  
  console.log('🔢 Mathematical Emojis (Mathojis):')
  console.log('─'.repeat(50))
  
  const mathojis = [
    { type: 'thinking', desc: 'Thinking/Analyzing' },
    { type: 'verified', desc: 'Verified/Proven' },
    { type: 'learning', desc: 'Learning/Updating' },
    { type: 'optimized', desc: 'Optimized/Improved' },
    { type: 'stable', desc: 'Stable/Equilibrium' },
    { type: 'warning', desc: 'Warning/Attention' },
    { type: 'ready', desc: 'Ready/Complete' }
  ] as const
  
  mathojis.forEach(({ type, desc }) => {
    const symbol = glyph.getMathoji(type)
    console.log(`  ${symbol} ${type.padEnd(10)} - ${desc}`)
  })
  
  console.log('\n💬 CLI Message Examples:')
  console.log('─'.repeat(50))
  
  const examples = [
    { action: 'Analyzing CI logs...', mathoji: 'thinking' },
    { action: 'Updating classifier weights', mathoji: 'learning' },
    { action: 'Fix validated (tests: 42/42)', mathoji: 'verified' },
    { action: 'Performance improved by 23%', mathoji: 'optimized' },
    { action: 'System equilibrium reached', mathoji: 'stable' },
    { action: 'High memory usage detected', mathoji: 'warning' }
  ]
  
  examples.forEach(({ action, mathoji }) => {
    console.log(`  ${glyph.getMathoji(mathoji)} ${action}`)
  })
  
  console.log('\n✨ Living Glyph System Demo Complete!')
  console.log('═'.repeat(50))
}

if (import.meta.main) {
  main()
}
