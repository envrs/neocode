import { SystemGlyph, type SystemState } from './system-glyph.js'
import { GlyphDiffEngine } from './glyph-diff.js'

export interface TemporalGlyphPoint {
  timestamp: number
  state: SystemState
  glyph: string[]
  metrics: {
    performance: number
    reliability: number
    complexity: number
    stability: number
  }
}

export interface LearningTrajectory {
  points: TemporalGlyphPoint[]
  trajectory: {
    trend: 'improving' | 'degrading' | 'stable' | 'volatile'
    velocity: number // Rate of change
    acceleration: number // Rate of change of rate
    convergence: number // How stable the system is becoming
  }
  insights: {
    learningRate: number
    adaptationSpeed: number
    optimalPoint?: TemporalGlyphPoint
    warningPoints: TemporalGlyphPoint[]
  }
}

export class TemporalGlyphEngine {
  // Generate a temporal sequence showing system evolution
  static generateTrajectory(
    states: { state: SystemState; timestamp: number }[]
  ): LearningTrajectory {
    const points: TemporalGlyphPoint[] = states.map(({ state, timestamp }) => {
      const glyph = new SystemGlyph(state)
      const renderedGlyph = glyph.generateCoreGlyph()
      
      // Calculate system metrics
      const metrics = this.calculateSystemMetrics(state, renderedGlyph)
      
      return {
        timestamp,
        state,
        glyph: renderedGlyph,
        metrics
      }
    })
    
    const trajectory = this.analyzeTrajectory(points)
    const insights = this.generateInsights(points, trajectory)
    
    return {
      points,
      trajectory,
      insights
    }
  }
  
  // Calculate system health metrics
  private static calculateSystemMetrics(
    state: SystemState, 
    glyph: string[]
  ): TemporalGlyphPoint['metrics'] {
    // Performance based on model version and config
    const performance = this.estimatePerformance(state)
    
    // Reliability based on environment and toolchain stability
    const reliability = this.estimateReliability(state)
    
    // Complexity based on config and toolchain size
    const complexity = this.estimateComplexity(state)
    
    // Stability based on glyph symmetry and consistency
    const stability = this.estimateStability(glyph)
    
    return {
      performance,
      reliability,
      complexity,
      stability
    }
  }
  
  private static estimatePerformance(state: SystemState): number {
    let score = 0.5 // baseline
    
    // Model version performance
    if (state.modelVersion.includes('pro')) score += 0.3
    if (state.modelVersion.includes('turbo')) score += 0.2
    
    // Config optimization
    const config = state.config
    if (config.temperature !== undefined) {
      score += (0.5 - config.temperature) * 0.2 // Lower temp = more focused
    }
    if (config.cache) score += 0.1
    if (config.debug === false) score += 0.1
    
    return Math.max(0, Math.min(1, score))
  }
  
  private static estimateReliability(state: SystemState): number {
    let score = 0.7 // baseline
    
    // Environment reliability
    if (state.environment === 'production') score += 0.2
    else if (state.environment === 'staging') score += 0.1
    else if (state.environment === 'development') score -= 0.1
    
    // Toolchain maturity
    const matureTools = ['typescript', 'bun', 'eslint']
    const toolchainScore = state.toolchain.filter(tool => matureTools.includes(tool)).length / state.toolchain.length
    score += toolchainScore * 0.2
    
    return Math.max(0, Math.min(1, score))
  }
  
  private static estimateComplexity(state: SystemState): number {
    const configComplexity = Object.keys(state.config).length / 10 // Normalize to 0-1
    const toolchainComplexity = state.toolchain.length / 8 // Normalize to 0-1
    
    return Math.min(1, (configComplexity + toolchainComplexity) / 2)
  }
  
  private static estimateStability(glyph: string[]): number {
    // Analyze glyph symmetry and consistency
    let symmetryScore = 0
    const size = glyph.length
    
    for (let i = 0; i < size; i++) {
      const line = glyph[i]
      const reversedLine = line.split('').reverse().join('')
      
      // Check horizontal symmetry
      let lineSymmetry = 0
      for (let j = 0; j < line.length / 2; j++) {
        if (line[j] === line[line.length - 1 - j]) {
          lineSymmetry++
        }
      }
      symmetryScore += lineSymmetry / (line.length / 2)
    }
    
    // Check vertical symmetry
    let verticalSymmetry = 0
    for (let i = 0; i < size / 2; i++) {
      if (glyph[i] === glyph[size - 1 - i]) {
        verticalSymmetry++
      }
    }
    
    const totalSymmetry = (symmetryScore / size + verticalSymmetry / (size / 2)) / 2
    return Math.min(1, totalSymmetry)
  }
  
  // Analyze trajectory patterns
  private static analyzeTrajectory(points: TemporalGlyphPoint[]): LearningTrajectory['trajectory'] {
    if (points.length < 2) {
      return {
        trend: 'stable',
        velocity: 0,
        acceleration: 0,
        convergence: 1
      }
    }
    
    // Calculate rates of change
    const performanceChanges = this.calculateRates(points.map(p => p.metrics.performance))
    const reliabilityChanges = this.calculateRates(points.map(p => p.metrics.reliability))
    const complexityChanges = this.calculateRates(points.map(p => p.metrics.complexity))
    const stabilityChanges = this.calculateRates(points.map(p => p.metrics.stability))
    
    // Overall velocity (weighted by importance)
    const velocity = (
      performanceChanges.average * 0.3 +
      reliabilityChanges.average * 0.3 +
      -complexityChanges.average * 0.2 + // Negative because less complexity is better
      stabilityChanges.average * 0.2
    )
    
    // Acceleration (change in velocity)
    const acceleration = performanceChanges.acceleration
    
    // Convergence (how stable rates are becoming)
    const convergence = 1 - Math.abs(performanceChanges.volatility + reliabilityChanges.volatility) / 2
    
    // Determine trend
    let trend: LearningTrajectory['trajectory']['trend']
    if (Math.abs(velocity) < 0.05) {
      trend = 'stable'
    } else if (velocity > 0.1) {
      trend = 'improving'
    } else if (velocity < -0.1) {
      trend = 'degrading'
    } else {
      trend = 'volatile'
    }
    
    return {
      trend,
      velocity,
      acceleration,
      convergence
    }
  }
  
  private static calculateRates(values: number[]): {
    average: number
    acceleration: number
    volatility: number
  } {
    if (values.length < 2) {
      return { average: 0, acceleration: 0, volatility: 0 }
    }
    
    const changes: number[] = []
    for (let i = 1; i < values.length; i++) {
      changes.push(values[i] - values[i - 1])
    }
    
    const average = changes.reduce((sum, change) => sum + change, 0) / changes.length
    
    // Acceleration is the change in changes
    let acceleration = 0
    if (changes.length > 1) {
      const changeChanges: number[] = []
      for (let i = 1; i < changes.length; i++) {
        changeChanges.push(changes[i] - changes[i - 1])
      }
      acceleration = changeChanges.reduce((sum, change) => sum + change, 0) / changeChanges.length
    }
    
    // Volatility is the variance in changes
    const variance = changes.reduce((sum, change) => sum + Math.pow(change - average, 2), 0) / changes.length
    const volatility = Math.sqrt(variance)
    
    return { average, acceleration, volatility }
  }
  
  // Generate insights from trajectory
  private static generateInsights(
    points: TemporalGlyphPoint[],
    trajectory: LearningTrajectory['trajectory']
  ): LearningTrajectory['insights'] {
    // Learning rate: how quickly the system improves
    const learningRate = Math.max(0, trajectory.velocity)
    
    // Adaptation speed: how quickly the system responds to changes
    const adaptationSpeed = 1 - trajectory.convergence
    
    // Find optimal point (best balance of metrics)
    const optimalPoint = points.reduce((best, current) => {
      const currentScore = current.metrics.performance + current.metrics.reliability + current.metrics.stability - current.metrics.complexity
      const bestScore = best.metrics.performance + best.metrics.reliability + best.metrics.stability - best.metrics.complexity
      return currentScore > bestScore ? current : best
    })
    
    // Find warning points (significant drops in metrics)
    const warningPoints = points.filter((point, index) => {
      if (index === 0) return false
      const prevPoint = points[index - 1]
      return (
        point.metrics.reliability < prevPoint.metrics.reliability - 0.2 ||
        point.metrics.stability < prevPoint.metrics.stability - 0.2
      )
    })
    
    return {
      learningRate,
      adaptationSpeed,
      optimalPoint,
      warningPoints
    }
  }
  
  // Render temporal evolution
  static renderTemporalEvolution(trajectory: LearningTrajectory): string[] {
    const output: string[] = []
    
    output.push('🕒 Temporal Glyph Evolution')
    output.push('═'.repeat(50))
    
    // Show trajectory summary
    output.push('\n📈 Trajectory Analysis:')
    output.push('─'.repeat(50))
    output.push(`Trend: ${trajectory.trajectory.trend.toUpperCase()}`)
    output.push(`Velocity: ${(trajectory.trajectory.velocity * 100).toFixed(1)}%/period`)
    output.push(`Acceleration: ${(trajectory.trajectory.acceleration * 100).toFixed(1)}%/period²`)
    output.push(`Convergence: ${(trajectory.trajectory.convergence * 100).toFixed(1)}%`)
    
    // Show insights
    output.push('\n🧠 Learning Insights:')
    output.push('─'.repeat(50))
    output.push(`Learning Rate: ${(trajectory.insights.learningRate * 100).toFixed(1)}%/period`)
    output.push(`Adaptation Speed: ${(trajectory.insights.adaptationSpeed * 100).toFixed(1)}%`)
    
    if (trajectory.insights.optimalPoint) {
      const optimal = trajectory.insights.optimalPoint
      output.push(`Optimal Point: ${new Date(optimal.timestamp).toLocaleString()}`)
      output.push(`  Performance: ${(optimal.metrics.performance * 100).toFixed(1)}%`)
      output.push(`  Reliability: ${(optimal.metrics.reliability * 100).toFixed(1)}%`)
    }
    
    if (trajectory.insights.warningPoints.length > 0) {
      output.push(`Warning Points: ${trajectory.insights.warningPoints.length}`)
      trajectory.insights.warningPoints.forEach(point => {
        output.push(`  ${new Date(point.timestamp).toLocaleString()}: Reliability dropped to ${(point.metrics.reliability * 100).toFixed(1)}%`)
      })
    }
    
    // Show visual evolution
    output.push('\n🎬 Visual Evolution:')
    output.push('─'.repeat(50))
    
    trajectory.points.forEach((point, index) => {
      const date = new Date(point.timestamp).toLocaleDateString()
      const time = new Date(point.timestamp).toLocaleTimeString()
      
      output.push(`\n${index + 1}. ${date} ${time}`)
      output.push(`   Performance: ${(point.metrics.performance * 100).toFixed(1)}% | Reliability: ${(point.metrics.reliability * 100).toFixed(1)}% | Stability: ${(point.metrics.stability * 100).toFixed(1)}%`)
      
      point.glyph.forEach(line => output.push(`   ${line}`))
    })
    
    return output
  }
  
  // Generate learning report
  static generateLearningReport(trajectory: LearningTrajectory): string {
    const { trajectory: traj, insights } = trajectory
    
    let report = `# Learning Trajectory Report\n\n`
    report += `**Period**: ${new Date(trajectory.points[0].timestamp).toLocaleDateString()} - ${new Date(trajectory.points[trajectory.points.length - 1].timestamp).toLocaleDateString()}\n`
    report += `**Data Points**: ${trajectory.points.length}\n\n`
    
    report += `## Executive Summary\n\n`
    report += `- **Trend**: ${traj.trend.toUpperCase()}\n`
    report += `- **Learning Rate**: ${(insights.learningRate * 100).toFixed(1)}% per period\n`
    report += `- **System Stability**: ${(traj.convergence * 100).toFixed(1)}%\n\n`
    
    if (traj.trend === 'improving') {
      report += `✅ **System is improving** with a velocity of ${(traj.velocity * 100).toFixed(1)}% per period.\n`
    } else if (traj.trend === 'degrading') {
      report += `⚠️ **System is degrading** with a velocity of ${(traj.velocity * 100).toFixed(1)}% per period.\n`
    } else if (traj.trend === 'volatile') {
      report += `🔄 **System is volatile** with inconsistent performance.\n`
    } else {
      report += `⚖️ **System is stable** with minimal changes.\n`
    }
    
    report += `\n## Key Insights\n\n`
    
    if (insights.optimalPoint) {
      report += `**Optimal Performance**: ${new Date(insights.optimalPoint.timestamp).toLocaleString()}\n`
      report += `- Performance: ${(insights.optimalPoint.metrics.performance * 100).toFixed(1)}%\n`
      report += `- Reliability: ${(insights.optimalPoint.metrics.reliability * 100).toFixed(1)}%\n\n`
    }
    
    if (insights.warningPoints.length > 0) {
      report += `**Warning Events**: ${insights.warningPoints.length} incidents detected\n`
      insights.warningPoints.forEach(point => {
        report += `- ${new Date(point.timestamp).toLocaleString()}: Reliability dropped to ${(point.metrics.reliability * 100).toFixed(1)}%\n`
      })
      report += '\n'
    }
    
    report += `## Recommendations\n\n`
    
    if (traj.trend === 'degrading') {
      report += `- 🔍 Investigate recent changes that may have caused degradation\n`
      report += `- 📊 Consider rollback to last known stable state\n`
    } else if (traj.trend === 'volatile') {
      report += `- 🔄 Stabilize configuration changes\n`
      report += `- 📈 Implement gradual rollout strategy\n`
    } else if (traj.trend === 'improving') {
      report += `- ✅ Continue current optimization strategy\n`
      report += `- 🎯 Set higher performance targets\n`
    }
    
    if (insights.adaptationSpeed > 0.5) {
      report += `- ⚡ System adapts quickly - consider more frequent updates\n`
    } else if (insights.adaptationSpeed < 0.2) {
      report += `- 🐌 System adapts slowly - consider more conservative changes\n`
    }
    
    return report
  }
}
