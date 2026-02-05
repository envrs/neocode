#!/usr/bin/env bun
import { LivingGlyph } from '../src/ui/glyph.js'

function main() {
  console.log('🧬 NeoCode Living Glyph Demo')
  console.log('═'.repeat(40))
  
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
  const splash = glyph.generateStartupSplash(metrics)
  splash.forEach(line => console.log(line))
  
  console.log('\n📊 Individual Components Demo')
  console.log('─'.repeat(40))
  
  // Demo individual components
  console.log('\n🎯 Core Glyph (different sizes):')
  const smallGlyph = new LivingGlyph({ size: 5, density: 0.7, symmetry: true })
  const mediumGlyph = new LivingGlyph({ size: 9, density: 0.6, symmetry: true })
  
  console.log('Small (5x5):')
  smallGlyph.generateCoreGlyph('AI').forEach(line => console.log(`  ${line}`))
  
  console.log('\nMedium (9x9):')
  mediumGlyph.generateCoreGlyph('CODE').forEach(line => console.log(`  ${line}`))
  
  console.log('\n⚡ Performance Waves:')
  const latencies = [0.05, 0.15, 0.25, 0.50, 1.0]
  latencies.forEach(latency => {
    const wave = glyph.generatePerformanceWave({ latency, throughput: 1000, load: 0.3 }, 15)
    console.log(`  ${latency.toFixed(2)}ms: ${wave}`)
  })
  
  console.log('\n🧬 Evolution Signals:')
  const entropies = [1.0, 0.8, 0.5, 0.2, 0.1]
  entropies.forEach((entropy, i) => {
    const signal = glyph.generateEvolutionSignal({
      generation: i * 50,
      accuracy: 0.5 + (i * 0.1),
      variance: 1.0 - (i * 0.2),
      entropy
    })
    console.log(`  Gen ${i * 50}: ${signal}`)
  })
  
  console.log('\n🎯 Confidence Bars:')
  const probabilities = [0.5, 0.7, 0.85, 0.95, 0.99]
  probabilities.forEach(prob => {
    const confidence = glyph.generateConfidenceBar({
      probability: prob,
      errorNorm: 1.0 - prob,
      confidence: prob
    })
    console.log(`  P=${prob.toFixed(2)}:`)
    confidence.forEach(line => console.log(`    ${line}`))
  })
  
  console.log('\n🔢 Mathojis:')
  const mathojis = ['thinking', 'verified', 'learning', 'optimized', 'stable', 'warning', 'ready'] as const
  mathojis.forEach(type => {
    const symbol = glyph.getMathoji(type)
    console.log(`  ${type}: ${symbol}`)
  })
  
  console.log('\n💬 Example CLI Messages:')
  console.log(`  ${glyph.getMathoji('thinking')} Analyzing CI logs...`)
  console.log(`  ${glyph.getMathoji('learning')} Updating classifier weights`)
  console.log(`  ${glyph.getMathoji('verified')} Fix validated (tests: 42/42)`)
  console.log(`  ${glyph.getMathoji('optimized')} Performance improved by 23%`)
  console.log(`  ${glyph.getMathoji('stable')} System equilibrium reached`)
  console.log(`  ${glyph.getMathoji('warning')} High memory usage detected`)
  
  console.log('\n✨ Demo Complete!')
}

if (import.meta.main) {
  main()
}
