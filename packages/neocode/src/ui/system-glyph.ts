import { LivingGlyph } from './glyph.js'
import { createHash } from 'crypto'

export interface SystemState {
  modelVersion: string
  config: Record<string, any>
  toolchain: string[]
  commitSha: string
  environment: string
}

export interface GlyphFingerprint {
  seed: number
  signature: string
  glyph: string[]
  metadata: {
    stateHash: string
    generatedAt: number
    environment: string
  }
}

export class SystemGlyph extends LivingGlyph {
  constructor(private systemState: SystemState) {
    super({
      size: 7,
      density: 0.8,
      symmetry: true,
      seed: SystemGlyph.generateSeedFromState(systemState)
    })
  }

  // Generate deterministic seed from system state
  private static generateSeedFromState(state: SystemState): number {
    const stateString = JSON.stringify({
      modelVersion: state.modelVersion,
      config: state.config,
      toolchain: state.toolchain.sort(),
      commitSha: state.commitSha,
      environment: state.environment
    })
    
    const hash = createHash('sha256').update(stateString).digest('hex')
    // Convert hash to number seed
    return parseInt(hash.substring(0, 8), 16)
  }

  // Generate fingerprint for this system state
  generateFingerprint(): GlyphFingerprint {
    const seed = SystemGlyph.generateSeedFromState(this.systemState)
    const stateHash = createHash('sha256')
      .update(JSON.stringify(this.systemState))
      .digest('hex')
    
    const glyph = this.generateCoreGlyph('NEO')
    
    return {
      seed,
      signature: this.generateSignature(),
      glyph,
      metadata: {
        stateHash,
        generatedAt: Date.now(),
        environment: this.systemState.environment
      }
    }
  }

  // Generate mathematical signature for the system
  private generateSignature(): string {
    const { modelVersion, config, toolchain, commitSha, environment } = this.systemState
    
    // Create a compact mathematical representation
    const modelHash = modelVersion.slice(0, 8)
    const configComplexity = Object.keys(config).length
    const toolchainCount = toolchain.length
    const commitShort = commitSha.slice(0, 7)
    
    return `${environment}:${modelHash}+${configComplexity}+${toolchainCount}@${commitShort}`
  }

  // Compare two system states
  static compareStates(state1: SystemState, state2: SystemState): {
    similarity: number
    differences: string[]
    compatibility: 'identical' | 'compatible' | 'incompatible'
  } {
    const differences: string[] = []
    
    if (state1.modelVersion !== state2.modelVersion) {
      differences.push(`model: ${state1.modelVersion} → ${state2.modelVersion}`)
    }
    
    if (state1.environment !== state2.environment) {
      differences.push(`env: ${state1.environment} → ${state2.environment}`)
    }
    
    const toolchainDiff = this.arrayDiff(state1.toolchain, state2.toolchain)
    if (toolchainDiff.added.length > 0 || toolchainDiff.removed.length > 0) {
      differences.push(`toolchain: +${toolchainDiff.added.join(',')} -${toolchainDiff.removed.join(',')}`)
    }
    
    const configDiff = this.configDiff(state1.config, state2.config)
    if (configDiff.length > 0) {
      differences.push(`config: ${configDiff.slice(0, 3).join(', ')}${configDiff.length > 3 ? '...' : ''}`)
    }
    
    const similarity = 1 - (differences.length / 10) // Rough similarity metric
    
    let compatibility: 'identical' | 'compatible' | 'incompatible'
    if (differences.length === 0) {
      compatibility = 'identical'
    } else if (similarity > 0.7) {
      compatibility = 'compatible'
    } else {
      compatibility = 'incompatible'
    }
    
    return { similarity, differences, compatibility }
  }

  private static arrayDiff(arr1: string[], arr2: string[]): { added: string[], removed: string[] } {
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
    
    return {
      added: arr2.filter(x => !set1.has(x)),
      removed: arr1.filter(x => !set2.has(x))
    }
  }

  private static configDiff(config1: Record<string, any>, config2: Record<string, any>): string[] {
    const differences: string[] = []
    const keys1 = new Set(Object.keys(config1))
    const keys2 = new Set(Object.keys(config2))
    
    // Added keys
    for (const key of keys2) {
      if (!keys1.has(key)) {
        differences.push(`+${key}`)
      }
    }
    
    // Removed keys
    for (const key of keys1) {
      if (!keys2.has(key)) {
        differences.push(`-${key}`)
      }
    }
    
    // Changed keys
    for (const key of keys1) {
      if (keys2.has(key) && JSON.stringify(config1[key]) !== JSON.stringify(config2[key])) {
        differences.push(`~${key}`)
      }
    }
    
    return differences
  }

  // Generate diagnostic glyph with failure awareness
  generateDiagnosticGlyph(healthStatus: {
    errors: number
    warnings: number
    performance: number
    reliability: number
  }): string[] {
    // Adjust glyph parameters based on system health
    const healthScore = (healthStatus.reliability + healthStatus.performance) / 2
    
    const config = {
      size: 7,
      density: Math.max(0.3, healthScore),
      symmetry: healthStatus.errors === 0, // Break symmetry if there are errors
      seed: SystemGlyph.generateSeedFromState(this.systemState)
    }
    
    const diagnosticGlyph = new LivingGlyph(config)
    const glyph = diagnosticGlyph.generateCoreGlyph()
    
    // Add health indicators
    const healthLine = this.generateHealthIndicator(healthStatus)
    
    return [
      ...glyph,
      '',
      healthLine,
      `errors: ${healthStatus.errors} | warnings: ${healthStatus.warnings}`,
      `reliability: ${(healthStatus.reliability * 100).toFixed(1)}% | performance: ${(healthStatus.performance * 100).toFixed(1)}%`
    ]
  }

  private generateHealthIndicator(health: {
    errors: number
    warnings: number
    performance: number
    reliability: number
  }): string {
    const overall = (health.reliability + health.performance) / 2
    
    if (health.errors > 0) {
      return `${this.getMathoji('warning')} System degraded (errors: ${health.errors})`
    }
    
    if (health.warnings > 0) {
      return `${this.getMathoji('warning')} System cautious (warnings: ${health.warnings})`
    }
    
    if (overall > 0.9) {
      return `${this.getMathoji('verified')} System optimal`
    }
    
    if (overall > 0.7) {
      return `${this.getMathoji('stable')} System stable`
    }
    
    return `${this.getMathoji('thinking')} System learning`
  }

  // Generate CI/PR signature
  generateCISignature(runMetrics: {
    totalRuns: number
    successRate: number
    avgLatency: number
    errorRate: number
  }): string {
    const confidence = 1 - runMetrics.errorRate
    const variance = runMetrics.successRate < 1 ? 0.1 : 0.01
    
    const confidenceBar = this.generateConfidenceBar({
      probability: confidence,
      errorNorm: runMetrics.errorRate,
      confidence: runMetrics.successRate
    })
    
    const evolution = this.generateEvolutionSignal({
      generation: runMetrics.totalRuns,
      accuracy: runMetrics.successRate,
      variance,
      entropy: runMetrics.errorRate
    })
    
    const signature = [
      `${this.getMathoji('verified')} NeoCode verified`,
      `μ↑ σ↓ over last ${runMetrics.totalRuns} runs`,
      `‖error⃗‖₂ = ${runMetrics.errorRate.toFixed(3)}`,
      `avg latency: ${runMetrics.avgLatency.toFixed(2)}ms`,
      `success rate: ${(runMetrics.successRate * 100).toFixed(1)}%`
    ]
    
    return signature.join('\n')
  }
}
