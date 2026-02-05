import { test, expect } from 'bun:test'
import { GlyphDiffEngine } from '../../src/ui/glyph-diff.js'

test('GlyphDiffEngine - Identical states produce no differences', () => {
  const state = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7, maxTokens: 4096 },
    toolchain: ['typescript', 'bun'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'development'
  }
  
  const diff = GlyphDiffEngine.computeDiff(state, state)
  
  expect(diff.similarity).toBe(1.0)
  expect(diff.differences.structural).toBe(0)
  expect(diff.differences.semantic).toHaveLength(0)
  expect(diff.interpretation.impact).toBe('minimal')
  expect(diff.interpretation.risk).toBe('low')
})

test('GlyphDiffEngine - Model version change detected as high impact', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'development'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'development'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  
  expect(diff.similarity).toBeLessThan(1.0)
  expect(diff.differences.semantic.some(change => change.includes('model:'))).toBe(true)
  expect(diff.interpretation.impact).toBe('significant')
  expect(diff.interpretation.recommendation).toContain('Model change')
})

test('GlyphDiffEngine - Environment change detected', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'staging'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'production'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  
  expect(diff.differences.semantic.some(change => change.includes('environment:'))).toBe(true)
  expect(diff.interpretation.recommendation).toContain('Environment change')
})

test('GlyphDiffEngine - Toolchain changes detected', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript', 'bun'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'development'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript', 'bun', 'eslint'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'development'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  
  expect(diff.differences.semantic.some(change => change.includes('toolchain:'))).toBe(true)
  expect(diff.differences.semantic.some(change => change.includes('+eslint'))).toBe(true)
})

test('GlyphDiffEngine - Config complexity changes detected', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'development'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7, maxTokens: 4096, debug: true },
    toolchain: ['typescript'],
    commitSha: 'a1b2c3d4e5f6789',
    environment: 'development'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  
  expect(diff.differences.semantic.some(change => change.includes('config complexity:'))).toBe(true)
  expect(diff.differences.semantic.some(change => change.includes('+2'))).toBe(true)
})

test('GlyphDiffEngine - Structural diff calculation', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: '1111111111111111',
    environment: 'development'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: '2222222222222222',
    environment: 'development'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  
  expect(diff.differences.structural).toBeGreaterThan(0)
  expect(diff.differences.structural).toBeLessThanOrEqual(1.0)
  expect(diff.fromGlyph).not.toEqual(diff.toGlyph)
})

test('GlyphDiffEngine - Impact assessment accuracy', () => {
  const minimalChange = {
    from: {
      modelVersion: 'gpt-5.2-turbo',
      config: { temperature: 0.7 },
      toolchain: ['typescript'],
      commitSha: '1111111111111111',
      environment: 'development'
    },
    to: {
      modelVersion: 'gpt-5.2-turbo',
      config: { temperature: 0.71 }, // Small change
      toolchain: ['typescript'],
      commitSha: '2222222222222222',
      environment: 'development'
    }
  }
  
  const significantChange = {
    from: {
      modelVersion: 'gpt-5.2-turbo',
      config: { temperature: 0.7 },
      toolchain: ['typescript'],
      commitSha: '1111111111111111',
      environment: 'development'
    },
    to: {
      modelVersion: 'gpt-5.2-turbo-pro', // Major change
      config: { temperature: 0.1, maxTokens: 1024, debug: false, cache: true },
      toolchain: ['typescript', 'bun', 'eslint', 'prettier'],
      commitSha: '2222222222222222',
      environment: 'production' // Major change
    }
  }
  
  const minimalDiff = GlyphDiffEngine.computeDiff(minimalChange.from, minimalChange.to)
  const significantDiff = GlyphDiffEngine.computeDiff(significantChange.from, significantChange.to)
  
  expect(minimalDiff.interpretation.impact).toBe('moderate') // Small config changes still register as moderate
  expect(significantDiff.interpretation.impact).toBe('critical') // Multiple major changes = critical
  expect(minimalDiff.similarity).toBeGreaterThan(significantDiff.similarity)
})

test('GlyphDiffEngine - Confidence calculation', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: '1111111111111111',
    environment: 'development'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.5, maxTokens: 2048 },
    toolchain: ['typescript', 'bun'],
    commitSha: '2222222222222222',
    environment: 'development'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  
  expect(diff.differences.confidence).toBeGreaterThanOrEqual(0)
  expect(diff.differences.confidence).toBeLessThanOrEqual(1.0)
  expect(typeof diff.differences.confidence).toBe('number')
})

test('GlyphDiffEngine - Render diff output format', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: '1111111111111111',
    environment: 'development'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.5 },
    toolchain: ['typescript', 'bun'],
    commitSha: '2222222222222222',
    environment: 'development'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  const render = GlyphDiffEngine.renderDiff(diff)
  
  expect(render).toBeInstanceOf(Array)
  expect(render.length).toBeGreaterThan(0)
  expect(render.some(line => line.includes('Glyph Diff Analysis'))).toBe(true)
  expect(render.some(line => line.includes('Visual Comparison'))).toBe(true)
  expect(render.some(line => line.includes('Semantic Changes'))).toBe(true)
  expect(render.some(line => line.includes('Impact Assessment'))).toBe(true)
})

test('GlyphDiffEngine - CI comment generation', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: '1111111111111111',
    environment: 'staging'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.5 },
    toolchain: ['typescript', 'bun'],
    commitSha: '2222222222222222',
    environment: 'production'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  const ciComment = GlyphDiffEngine.generateCIComment(diff)
  
  expect(ciComment).toContain('System State Analysis')
  expect(ciComment).toContain('Similarity')
  expect(ciComment).toContain('Impact')
  expect(ciComment).toContain('Risk')
  expect(ciComment).toContain('Recommendation')
  expect(ciComment).toContain('Visual Fingerprint')
  expect(ciComment).toContain('```') // Code block for glyph
})

test('GlyphDiffEngine - Complex multi-change scenario', () => {
  const fromState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7, maxTokens: 4096, debug: true },
    toolchain: ['typescript', 'bun', 'eslint'],
    commitSha: '1111111111111111',
    environment: 'development'
  }
  
  const toState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.1, maxTokens: 1024, cache: true },
    toolchain: ['typescript', 'bun', 'prettier', 'webpack'],
    commitSha: '2222222222222222',
    environment: 'production'
  }
  
  const diff = GlyphDiffEngine.computeDiff(fromState, toState)
  
  expect(diff.differences.semantic.length).toBeGreaterThanOrEqual(3) // Exactly 3 changes detected
  expect(diff.differences.semantic.some(change => change.includes('model:'))).toBe(true)
  expect(diff.differences.semantic.some(change => change.includes('environment:'))).toBe(true)
  expect(diff.differences.semantic.some(change => change.includes('toolchain:'))).toBe(true)
  expect(diff.interpretation.impact).toBe('critical') // Multiple major changes = critical
  expect(diff.interpretation.risk).toBe('high') // Environment changes elevate risk
})

test('GlyphDiffEngine - Risk assessment logic', () => {
  // Test high-risk scenario (environment change)
  const envChangeDiff = GlyphDiffEngine.computeDiff(
    {
      modelVersion: 'gpt-5.2-turbo',
      config: { temperature: 0.7 },
      toolchain: ['typescript'],
      commitSha: '1111111111111111',
      environment: 'staging'
    },
    {
      modelVersion: 'gpt-5.2-turbo',
      config: { temperature: 0.7 },
      toolchain: ['typescript'],
      commitSha: '2222222222222222',
      environment: 'production'
    }
  )
  
  // Test low-risk scenario (minor config change)
  const configChangeDiff = GlyphDiffEngine.computeDiff(
    {
      modelVersion: 'gpt-5.2-turbo',
      config: { temperature: 0.7 },
      toolchain: ['typescript'],
      commitSha: '1111111111111111',
      environment: 'development'
    },
    {
      modelVersion: 'gpt-5.2-turbo',
      config: { temperature: 0.71 },
      toolchain: ['typescript'],
      commitSha: '2222222222222222',
      environment: 'development'
    }
  )
  
  expect(envChangeDiff.interpretation.risk).toBe('medium')
  expect(configChangeDiff.interpretation.risk).toBe('low')
})
