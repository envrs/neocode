import { test, expect } from 'bun:test'
import { TemporalGlyphEngine } from '../../src/ui/temporal-glyph.js'

test('TemporalGlyphEngine - Single point trajectory', () => {
  const state = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7, maxTokens: 4096 },
    toolchain: ['typescript', 'bun'],
    commitSha: '1111111111111111',
    environment: 'development'
  }
  
  const trajectory = TemporalGlyphEngine.generateTrajectory([
    { state, timestamp: Date.now() }
  ])
  
  expect(trajectory.points).toHaveLength(1)
  expect(trajectory.trajectory.trend).toBe('stable')
  expect(trajectory.trajectory.velocity).toBe(0)
  expect(trajectory.trajectory.acceleration).toBe(0)
  expect(trajectory.trajectory.convergence).toBe(1)
})

test('TemporalGlyphEngine - Multiple point trajectory analysis', () => {
  const baseState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7, maxTokens: 4096 },
    toolchain: ['typescript', 'bun'],
    commitSha: '1111111111111111',
    environment: 'development'
  }
  
  const improvedState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.3, maxTokens: 2048, cache: true },
    toolchain: ['typescript', 'bun', 'eslint'],
    commitSha: '2222222222222222',
    environment: 'staging'
  }
  
  const trajectory = TemporalGlyphEngine.generateTrajectory([
    { state: baseState, timestamp: Date.now() - 1000 },
    { state: improvedState, timestamp: Date.now() }
  ])
  
  expect(trajectory.points).toHaveLength(2)
  expect(trajectory.trajectory.trend).toBe('improving')
  expect(trajectory.trajectory.velocity).toBeGreaterThan(0)
  expect(trajectory.insights.learningRate).toBeGreaterThan(0)
})

test('TemporalGlyphEngine - Performance metric calculation', () => {
  const highPerfState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.1, maxTokens: 1024, cache: true, debug: false },
    toolchain: ['typescript', 'bun', 'eslint'],
    commitSha: '1111111111111111',
    environment: 'production'
  }
  
  const lowPerfState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.9, maxTokens: 8192, debug: true },
    toolchain: ['typescript'],
    commitSha: '2222222222222222',
    environment: 'development'
  }
  
  const highPerfTrajectory = TemporalGlyphEngine.generateTrajectory([
    { state: highPerfState, timestamp: Date.now() }
  ])
  
  const lowPerfTrajectory = TemporalGlyphEngine.generateTrajectory([
    { state: lowPerfState, timestamp: Date.now() }
  ])
  
  expect(highPerfTrajectory.points[0].metrics.performance).toBeGreaterThan(
    lowPerfTrajectory.points[0].metrics.performance
  )
})

test('TemporalGlyphEngine - Reliability metric calculation', () => {
  const prodState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.3 },
    toolchain: ['typescript', 'bun', 'eslint', 'prettier'],
    commitSha: '1111111111111111',
    environment: 'production'
  }
  
  const devState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: '2222222222222222',
    environment: 'development'
  }
  
  const prodTrajectory = TemporalGlyphEngine.generateTrajectory([
    { state: prodState, timestamp: Date.now() }
  ])
  
  const devTrajectory = TemporalGlyphEngine.generateTrajectory([
    { state: devState, timestamp: Date.now() }
  ])
  
  expect(prodTrajectory.points[0].metrics.reliability).toBeGreaterThan(
    devTrajectory.points[0].metrics.reliability
  )
})

test('TemporalGlyphEngine - Complexity metric calculation', () => {
  const simpleState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.7 },
    toolchain: ['typescript'],
    commitSha: '1111111111111111',
    environment: 'development'
  }
  
  const complexState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.3, maxTokens: 1024, cache: true, debug: false, timeout: 30000, retries: 3 },
    toolchain: ['typescript', 'bun', 'eslint', 'prettier', 'webpack', 'jest'],
    commitSha: '2222222222222222',
    environment: 'production'
  }
  
  const simpleTrajectory = TemporalGlyphEngine.generateTrajectory([
    { state: simpleState, timestamp: Date.now() }
  ])
  
  const complexTrajectory = TemporalGlyphEngine.generateTrajectory([
    { state: complexState, timestamp: Date.now() }
  ])
  
  expect(complexTrajectory.points[0].metrics.complexity).toBeGreaterThan(
    simpleTrajectory.points[0].metrics.complexity
  )
})

test('TemporalGlyphEngine - Degradation detection', () => {
  const goodState = {
    modelVersion: 'gpt-5.2-turbo-pro',
    config: { temperature: 0.1, maxTokens: 1024, cache: true },
    toolchain: ['typescript', 'bun', 'eslint'],
    commitSha: '1111111111111111',
    environment: 'production'
  }
  
  const degradedState = {
    modelVersion: 'gpt-5.2-turbo',
    config: { temperature: 0.9, maxTokens: 8192, debug: true },
    toolchain: ['typescript'],
    commitSha: '2222222222222222',
    environment: 'development'
  }
  
  const trajectory = TemporalGlyphEngine.generateTrajectory([
    { state: goodState, timestamp: Date.now() - 1000 },
    { state: degradedState, timestamp: Date.now() }
  ])
  
  expect(trajectory.trajectory.trend).toBe('degrading')
  expect(trajectory.trajectory.velocity).toBeLessThan(0)
})

test('TemporalGlyphEngine - Optimal point identification', () => {
  const states = [
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.9, maxTokens: 8192 },
        toolchain: ['typescript'],
        commitSha: '1111111111111111',
        environment: 'development'
      },
      timestamp: Date.now() - 3000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo-pro',
        config: { temperature: 0.1, maxTokens: 1024, cache: true },
        toolchain: ['typescript', 'bun', 'eslint'],
        commitSha: '2222222222222222',
        environment: 'production'
      },
      timestamp: Date.now() - 2000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.5, maxTokens: 2048 },
        toolchain: ['typescript', 'bun'],
        commitSha: '3333333333333333',
        environment: 'staging'
      },
      timestamp: Date.now() - 1000
    }
  ]
  
  const trajectory = TemporalGlyphEngine.generateTrajectory(states)
  
  expect(trajectory.insights.optimalPoint).toBeDefined()
  expect(trajectory.insights.optimalPoint!.metrics.performance).toBeGreaterThan(0.8)
  expect(trajectory.insights.optimalPoint!.metrics.reliability).toBeGreaterThan(0.8)
})

test('TemporalGlyphEngine - Convergence calculation', () => {
  // Stable system (minimal changes)
  const stableStates = [
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ['typescript', 'bun'],
        commitSha: '1111111111111111',
        environment: 'production'
      },
      timestamp: Date.now() - 3000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.68, maxTokens: 4096 }, // Small change
        toolchain: ['typescript', 'bun'],
        commitSha: '2222222222222222',
        environment: 'production'
      },
      timestamp: Date.now() - 2000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.66, maxTokens: 4096 }, // Small change
        toolchain: ['typescript', 'bun'],
        commitSha: '3333333333333333',
        environment: 'production'
      },
      timestamp: Date.now() - 1000
    }
  ]
  
  const stableTrajectory = TemporalGlyphEngine.generateTrajectory(stableStates)
  
  // Volatile system (large changes)
  const volatileStates = [
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.1, maxTokens: 1024 },
        toolchain: ['typescript'],
        commitSha: '1111111111111111',
        environment: 'production'
      },
      timestamp: Date.now() - 3000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo-pro',
        config: { temperature: 0.9, maxTokens: 8192, debug: true },
        toolchain: ['typescript', 'bun', 'eslint', 'prettier'],
        commitSha: '2222222222222222',
        environment: 'development'
      },
      timestamp: Date.now() - 2000
    },
    {
      state: {
        modelVersion: 'gpt-5.1',
        config: { temperature: 0.5, maxTokens: 2048, cache: false },
        toolchain: ['typescript', 'bun'],
        commitSha: '3333333333333333',
        environment: 'staging'
      },
      timestamp: Date.now() - 1000
    }
  ]
  
  const volatileTrajectory = TemporalGlyphEngine.generateTrajectory(volatileStates)
  
  expect(stableTrajectory.trajectory.convergence).toBeGreaterThan(
    volatileTrajectory.trajectory.convergence
  )
})

test('TemporalGlyphEngine - Render output format', () => {
  const trajectory = TemporalGlyphEngine.generateTrajectory([
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ['typescript', 'bun'],
        commitSha: '1111111111111111',
        environment: 'development'
      },
      timestamp: Date.now()
    }
  ])
  
  const render = TemporalGlyphEngine.renderTemporalEvolution(trajectory)
  
  expect(render).toBeInstanceOf(Array)
  expect(render.length).toBeGreaterThan(0)
  expect(render.some(line => line.includes('Temporal Glyph Evolution'))).toBe(true)
  expect(render.some(line => line.includes('Trajectory Analysis'))).toBe(true)
  expect(render.some(line => line.includes('Learning Insights'))).toBe(true)
  expect(render.some(line => line.includes('Visual Evolution'))).toBe(true)
})

test('TemporalGlyphEngine - Learning report generation', () => {
  const trajectory = TemporalGlyphEngine.generateTrajectory([
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ['typescript', 'bun'],
        commitSha: '1111111111111111',
        environment: 'development'
      },
      timestamp: Date.now() - 2000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo-pro',
        config: { temperature: 0.3, maxTokens: 2048, cache: true },
        toolchain: ['typescript', 'bun', 'eslint'],
        commitSha: '2222222222222222',
        environment: 'staging'
      },
      timestamp: Date.now() - 1000
    }
  ])
  
  const report = TemporalGlyphEngine.generateLearningReport(trajectory)
  
  expect(report).toContain('Learning Trajectory Report')
  expect(report).toContain('Executive Summary')
  expect(report).toContain('Key Insights')
  expect(report).toContain('Recommendations')
  expect(report).toContain('**Trend**:')
  expect(report).toContain('**Learning Rate**:')
  expect(report).toContain('**System Stability**:')
})

test('TemporalGlyphEngine - Velocity and acceleration calculations', () => {
  const improvingStates = [
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.9, maxTokens: 8192 },
        toolchain: ['typescript'],
        commitSha: '1111111111111111',
        environment: 'development'
      },
      timestamp: Date.now() - 3000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.5, maxTokens: 4096 },
        toolchain: ['typescript', 'bun'],
        commitSha: '2222222222222222',
        environment: 'staging'
      },
      timestamp: Date.now() - 2000
    },
    {
      state: {
        modelVersion: 'gpt-5.2-turbo-pro',
        config: { temperature: 0.1, maxTokens: 1024, cache: true },
        toolchain: ['typescript', 'bun', 'eslint'],
        commitSha: '3333333333333333',
        environment: 'production'
      },
      timestamp: Date.now() - 1000
    }
  ]
  
  const trajectory = TemporalGlyphEngine.generateTrajectory(improvingStates)
  
  expect(trajectory.trajectory.velocity).toBeGreaterThan(0)
  expect(typeof trajectory.trajectory.acceleration).toBe('number')
})

test('TemporalGlyphEngine - Stability estimation from glyph', () => {
  const trajectory = TemporalGlyphEngine.generateTrajectory([
    {
      state: {
        modelVersion: 'gpt-5.2-turbo',
        config: { temperature: 0.7, maxTokens: 4096 },
        toolchain: ['typescript', 'bun'],
        commitSha: '1111111111111111',
        environment: 'development'
      },
      timestamp: Date.now()
    }
  ])
  
  const stability = trajectory.points[0].metrics.stability
  
  expect(stability).toBeGreaterThanOrEqual(0)
  expect(stability).toBeLessThanOrEqual(1)
  expect(typeof stability).toBe('number')
})
