import { SystemGlyph, type SystemState } from './system-glyph.js'

export interface GlyphDiff {
  fromState: SystemState
  toState: SystemState
  fromGlyph: string[]
  toGlyph: string[]
  similarity: number
  differences: {
    structural: number // Visual glyph differences
    semantic: string[] // Meaningful state differences
    confidence: number // How certain we are about the diff
  }
  interpretation: {
    impact: 'minimal' | 'moderate' | 'significant' | 'critical'
    risk: 'low' | 'medium' | 'high' | 'unknown'
    recommendation: string
  }
}

export class GlyphDiffEngine {
  // Compute visual difference between two glyphs
  private static computeStructuralDiff(glyph1: string[], glyph2: string[]): number {
    if (glyph1.length !== glyph2.length) return 1.0
    
    let differences = 0
    let totalCells = 0
    
    for (let i = 0; i < glyph1.length; i++) {
      const line1 = glyph1[i]
      const line2 = glyph2[i]
      
      for (let j = 0; j < Math.min(line1.length, line2.length); j++) {
        if (line1[j] !== line2[j]) {
          differences++
        }
        totalCells++
      }
    }
    
    return totalCells > 0 ? differences / totalCells : 0
  }
  
  // Analyze semantic impact of state changes
  private static analyzeSemanticImpact(
    fromState: SystemState, 
    toState: SystemState
  ): { impact: number, criticalChanges: string[] } {
    const criticalChanges: string[] = []
    let impactScore = 0
    
    // Model version changes are high impact
    if (fromState.modelVersion !== toState.modelVersion) {
      criticalChanges.push(`model: ${fromState.modelVersion} → ${toState.modelVersion}`)
      impactScore += 0.4
    }
    
    // Environment changes are significant
    if (fromState.environment !== toState.environment) {
      criticalChanges.push(`environment: ${fromState.environment} → ${toState.environment}`)
      impactScore += 0.3
    }
    
    // Toolchain changes
    const toolchainDiff = this.arrayDiff(fromState.toolchain, toState.toolchain)
    if (toolchainDiff.added.length > 0 || toolchainDiff.removed.length > 0) {
      criticalChanges.push(`toolchain: +${toolchainDiff.added.join(',')} -${toolchainDiff.removed.join(',')}`)
      impactScore += 0.2
    }
    
    // Config complexity changes
    const configComplexityDiff = Object.keys(toState.config).length - Object.keys(fromState.config).length
    if (Math.abs(configComplexityDiff) > 0) {
      criticalChanges.push(`config complexity: ${configComplexityDiff > 0 ? '+' : ''}${configComplexityDiff}`)
      impactScore += Math.abs(configComplexityDiff) * 0.05
    }
    
    return {
      impact: Math.min(1.0, impactScore),
      criticalChanges
    }
  }
  
  private static arrayDiff(arr1: string[], arr2: string[]): { added: string[], removed: string[] } {
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
    
    return {
      added: arr2.filter(x => !set1.has(x)),
      removed: arr1.filter(x => !set2.has(x))
    }
  }
  
  // Generate interpretation of the diff
  private static interpretDiff(
    structuralDiff: number,
    semanticImpact: number,
    criticalChanges: string[]
  ): GlyphDiff['interpretation'] {
    const combinedImpact = (structuralDiff + semanticImpact) / 2
    
    let impact: GlyphDiff['interpretation']['impact']
    let risk: GlyphDiff['interpretation']['risk']
    let recommendation: string
    
    if (combinedImpact < 0.1) {
      impact = 'minimal'
      risk = 'low'
      recommendation = 'Changes are cosmetic, safe to proceed'
    } else if (combinedImpact < 0.3) {
      impact = 'moderate'
      risk = criticalChanges.some(c => c.includes('model')) ? 'medium' : 'low'
      recommendation = 'Review changes, but likely safe'
    } else if (combinedImpact < 0.6) {
      impact = 'significant'
      risk = 'medium'
      recommendation = 'Careful review required, consider testing'
    } else {
      impact = 'critical'
      risk = criticalChanges.some(c => c.includes('environment')) ? 'high' : 'medium'
      recommendation = 'Extensive testing required, high-risk changes'
    }
    
    // Add specific recommendations based on change types
    if (criticalChanges.some(c => c.includes('model'))) {
      recommendation += ' | Model change may affect behavior'
    }
    
    if (criticalChanges.some(c => c.includes('environment'))) {
      recommendation += ' | Environment change requires deployment verification'
    }
    
    return { impact, risk, recommendation }
  }
  
  // Compute comprehensive diff between two system states
  static computeDiff(fromState: SystemState, toState: SystemState): GlyphDiff {
    const fromGlyph = new SystemGlyph(fromState)
    const toGlyph = new SystemGlyph(toState)
    
    const fromGlyphRender = fromGlyph.generateCoreGlyph()
    const toGlyphRender = toGlyph.generateCoreGlyph()
    
    const structuralDiff = this.computeStructuralDiff(fromGlyphRender, toGlyphRender)
    const semanticAnalysis = this.analyzeSemanticImpact(fromState, toState)
    
    const comparison = SystemGlyph.compareStates(fromState, toState)
    const interpretation = this.interpretDiff(
      structuralDiff,
      semanticAnalysis.impact,
      semanticAnalysis.criticalChanges
    )
    
    return {
      fromState,
      toState,
      fromGlyph: fromGlyphRender,
      toGlyph: toGlyphRender,
      similarity: comparison.similarity,
      differences: {
        structural: structuralDiff,
        semantic: semanticAnalysis.criticalChanges,
        confidence: 1.0 - Math.abs(structuralDiff - semanticAnalysis.impact) // Consistency check
      },
      interpretation
    }
  }
  
  // Generate visual diff representation
  static renderDiff(diff: GlyphDiff): string[] {
    const output: string[] = []
    
    output.push('🔍 Glyph Diff Analysis')
    output.push('═'.repeat(50))
    
    // Show side-by-side glyphs
    output.push('\n📊 Visual Comparison:')
    output.push('─'.repeat(50))
    output.push('From State → To State:')
    
    for (let i = 0; i < Math.max(diff.fromGlyph.length, diff.toGlyph.length); i++) {
      const fromLine = diff.fromGlyph[i] || ''.repeat(diff.fromGlyph[0]?.length || 0)
      const toLine = diff.toGlyph[i] || ''.repeat(diff.toGlyph[0]?.length || 0)
      
      // Highlight differences
      let highlightedLine = ''
      for (let j = 0; j < Math.max(fromLine.length, toLine.length); j++) {
        const fromChar = fromLine[j] || ' '
        const toChar = toLine[j] || ' '
        
        if (fromChar === toChar) {
          highlightedLine += toChar
        } else {
          highlightedLine += `🔴${toChar}🔴` // Highlight changes
        }
      }
      
      output.push(`  ${fromLine} → ${highlightedLine.replace(/🔴/g, '')}`)
    }
    
    // Show semantic differences
    output.push('\n📋 Semantic Changes:')
    output.push('─'.repeat(50))
    if (diff.differences.semantic.length === 0) {
      output.push('  No semantic differences detected')
    } else {
      diff.differences.semantic.forEach(change => {
        output.push(`  🔄 ${change}`)
      })
    }
    
    // Show interpretation
    output.push('\n🎯 Impact Assessment:')
    output.push('─'.repeat(50))
    output.push(`  Impact: ${diff.interpretation.impact.toUpperCase()}`)
    output.push(`  Risk: ${diff.interpretation.risk.toUpperCase()}`)
    output.push(`  Similarity: ${(diff.similarity * 100).toFixed(1)}%`)
    output.push(`  Structural diff: ${(diff.differences.structural * 100).toFixed(1)}%`)
    output.push(`  Confidence: ${(diff.differences.confidence * 100).toFixed(1)}%`)
    output.push(`  Recommendation: ${diff.interpretation.recommendation}`)
    
    return output
  }
  
  // Generate diff summary for CI/PR
  static generateCIComment(diff: GlyphDiff): string {
    const { interpretation, similarity, differences } = diff
    
    let comment = `## 🔍 System State Analysis\n\n`
    comment += `**Similarity**: ${(similarity * 100).toFixed(1)}%\n`
    comment += `**Impact**: ${interpretation.impact.toUpperCase()}\n`
    comment += `**Risk**: ${interpretation.risk.toUpperCase()}\n\n`
    
    if (differences.semantic.length > 0) {
      comment += `### Changes Detected:\n`
      differences.semantic.forEach(change => {
        comment += `- ${change}\n`
      })
      comment += '\n'
    }
    
    comment += `### Recommendation:\n${interpretation.recommendation}\n\n`
    
    // Add glyph visualization
    comment += `### Visual Fingerprint:\n`
    comment += '```\n'
    diff.toGlyph.forEach(line => {
      comment += `${line}\n`
    })
    comment += '```\n'
    
    return comment
  }
}
