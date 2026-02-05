export interface GlyphConfig {
  size: number
  density: number
  symmetry: boolean
  seed?: number
}

export interface PerformanceMetrics {
  latency: number
  throughput: number
  load: number
}

export interface EvolutionMetrics {
  generation: number
  accuracy: number
  variance: number
  entropy: number
}

export interface ConfidenceMetrics {
  probability: number
  errorNorm: number
  confidence: number
}

export class LivingGlyph {
  private readonly blocks = ['░', '▒', '▓', '█']
  private readonly mathojis = {
    thinking: '∴',
    verified: '⊢',
    learning: '∂',
    optimized: '∇',
    stable: '≡',
    warning: 'Δ',
    ready: '▸'
  }

  constructor(private config: GlyphConfig) {}

  // Core glyph generation using matrix-based patterns
  generateCoreGlyph(label?: string): string[] {
    const { size, density, symmetry, seed } = this.config
    const matrix = this.generateMatrix(size, density, seed)
    
    if (symmetry) {
      return this.renderSymmetricGlyph(matrix, label)
    }
    return this.renderGlyph(matrix, label)
  }

  private generateMatrix(size: number, density: number, seed?: number): number[][] {
    const rng = seed ? this.seededRandom(seed) : Math.random
    const matrix: number[][] = []
    
    for (let i = 0; i < size; i++) {
      matrix[i] = []
      for (let j = 0; j < size; j++) {
        // Create radial gradient from center
        const centerX = size / 2
        const centerY = size / 2
        const distance = Math.sqrt(Math.pow(i - centerY, 2) + Math.pow(j - centerX, 2))
        const maxDistance = Math.sqrt(Math.pow(centerY, 2) + Math.pow(centerX, 2))
        const normalizedDistance = distance / maxDistance
        
        // Combine radial gradient with noise
        const noise = rng()
        const value = Math.max(0, Math.min(1, (1 - normalizedDistance) * density + noise * 0.3))
        
        matrix[i][j] = value
      }
    }
    
    return matrix
  }

  private renderSymmetricGlyph(matrix: number[][], label?: string): string[] {
    const size = matrix.length
    const lines: string[] = []
    const centerIndex = Math.floor(size / 2)
    
    for (let i = 0; i < size; i++) {
      let line = ''
      
      for (let j = 0; j < size; j++) {
        const value = matrix[i][j]
        const blockIndex = Math.floor(value * this.blocks.length)
        const block = this.blocks[Math.min(blockIndex, this.blocks.length - 1)]
        
        // Add label in center if provided
        if (label && i === centerIndex) {
          const labelStart = Math.floor((size - label.length) / 2)
          const labelEnd = labelStart + label.length
          
          if (j >= labelStart && j < labelEnd) {
            line += label[j - labelStart]
            continue
          }
        }
        
        line += block
      }
      
      lines.push(line)
    }
    
    return lines
  }

  private renderGlyph(matrix: number[][], label?: string): string[] {
    const size = matrix.length
    const lines: string[] = []
    
    for (let i = 0; i < size; i++) {
      let line = ''
      
      for (let j = 0; j < size; j++) {
        const value = matrix[i][j]
        const blockIndex = Math.floor(value * this.blocks.length)
        const block = this.blocks[Math.min(blockIndex, this.blocks.length - 1)]
        line += block
      }
      
      lines.push(line)
    }
    
    return lines
  }

  // Performance indicator with sine wave
  generatePerformanceWave(metrics: PerformanceMetrics, width: number = 20): string {
    const wave = this.generateSineWave(width, metrics.latency)
    const perfText = `${wave}  ${metrics.latency.toFixed(2)}ms`
    return perfText
  }

  private generateSineWave(width: number, latency: number): string {
    const waveChars = [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█']
    const wave: string[] = []
    
    for (let i = 0; i < width; i++) {
      const phase = (i / width) * Math.PI * 2
      const amplitude = Math.sin(phase) * 0.5 + 0.5
      const charIndex = Math.floor(amplitude * (waveChars.length - 1))
      wave.push(waveChars[charIndex])
    }
    
    return wave.join('')
  }

  // Evolution signal with entropy visualization
  generateEvolutionSignal(metrics: EvolutionMetrics): string {
    const entropyBar = this.generateEntropyBar(metrics.entropy, 15)
    const evolutionText = `Δt=${metrics.generation}  |  μ↑ σ↓`
    return `${entropyBar}  ${evolutionText}`
  }

  private generateEntropyBar(entropy: number, width: number): string {
    const filled = Math.floor(entropy * width)
    const empty = width - filled
    
    const filledChars = '█'.repeat(filled)
    const emptyChars = '░'.repeat(empty)
    
    return filledChars + emptyChars
  }

  // Confidence visualization
  generateConfidenceBar(metrics: ConfidenceMetrics): string[] {
    const probabilityBar = this.generateProbabilityBar(metrics.probability, 20)
    const errorNormText = `‖error⃗‖₂ = ${metrics.errorNorm.toFixed(3)}`
    
    return [
      `P(correct) = ${metrics.probability.toFixed(3)}`,
      probabilityBar,
      errorNormText
    ]
  }

  private generateProbabilityBar(probability: number, width: number): string {
    const filled = Math.floor(probability * width)
    const empty = width - filled
    
    const filledChars = '█'.repeat(filled)
    const emptyChars = '░'.repeat(empty)
    
    return filledChars + emptyChars
  }

  // Mathojis for CLI messages
  getMathoji(type: keyof typeof this.mathojis): string {
    return this.mathojis[type]
  }

  // Full startup splash
  generateStartupSplash(metrics: {
    performance: PerformanceMetrics
    evolution: EvolutionMetrics
    confidence: ConfidenceMetrics
  }): string[] {
    const glyph = this.generateCoreGlyph('NEO')
    const performance = this.generatePerformanceWave(metrics.performance)
    const evolution = this.generateEvolutionSignal(metrics.evolution)
    const confidence = this.generateConfidenceBar(metrics.confidence)
    
    const splash: string[] = [
      '',
      ...glyph,
      '',
      `${this.getMathoji('thinking')} Artificial CLI Intelligence`,
      '─'.repeat(28),
      `perf     : ${performance}`,
      `evolution: ${evolution}`,
      `accuracy : P=${metrics.confidence.probability.toFixed(3)} ${this.getMathoji('verified')}`,
      '',
      `ready ${this.getMathoji('ready')}`,
      ''
    ]
    
    return splash
  }

  private seededRandom(seed: number): () => number {
    let value = seed
    return () => {
      value = (value * 9301 + 49297) % 233280
      return value / 233280
    }
  }
}
