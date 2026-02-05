import { test, expect } from "bun:test"
import { LivingGlyph } from "../../src/ui/glyph.js"

test("LivingGlyph - Core glyph generation", () => {
  const glyph = new LivingGlyph({
    size: 5,
    density: 0.8,
    symmetry: true,
    seed: 42,
  })

  const result = glyph.generateCoreGlyph("TEST")

  expect(result).toHaveLength(5)
  expect(result[0]).toHaveLength(5)
  expect(result[2]).toContain("TEST")
})

test("LivingGlyph - Deterministic generation with seed", () => {
  const glyph1 = new LivingGlyph({
    size: 5,
    density: 0.7,
    symmetry: true,
    seed: 123,
  })

  const glyph2 = new LivingGlyph({
    size: 5,
    density: 0.7,
    symmetry: true,
    seed: 123,
  })

  const result1 = glyph1.generateCoreGlyph()
  const result2 = glyph2.generateCoreGlyph()

  expect(result1).toEqual(result2)
})

test("LivingGlyph - Different seeds produce different results", () => {
  const glyph1 = new LivingGlyph({
    size: 5,
    density: 0.7,
    symmetry: true,
    seed: 123,
  })

  const glyph2 = new LivingGlyph({
    size: 5,
    density: 0.7,
    symmetry: true,
    seed: 456,
  })

  const result1 = glyph1.generateCoreGlyph()
  const result2 = glyph2.generateCoreGlyph()

  expect(result1).not.toEqual(result2)
})

test("LivingGlyph - Performance wave generation", () => {
  const glyph = new LivingGlyph({ size: 5, density: 0.5, symmetry: true })

  const metrics = {
    latency: 0.25,
    throughput: 1000,
    load: 0.3,
  }

  const result = glyph.generatePerformanceWave(metrics, 10)

  expect(result).toContain("0.25ms")
  expect(result.length).toBeGreaterThan(10) // wave + latency text
})

test("LivingGlyph - Evolution signal generation", () => {
  const glyph = new LivingGlyph({ size: 5, density: 0.5, symmetry: true })

  const metrics = {
    generation: 100,
    accuracy: 0.85,
    variance: 0.15,
    entropy: 0.4,
  }

  const result = glyph.generateEvolutionSignal(metrics)

  expect(result).toContain("Δt=100")
  expect(result).toContain("μ↑ σ↓")
})

test("LivingGlyph - Confidence bar generation", () => {
  const glyph = new LivingGlyph({ size: 5, density: 0.5, symmetry: true })

  const metrics = {
    probability: 0.95,
    errorNorm: 0.05,
    confidence: 0.98,
  }

  const result = glyph.generateConfidenceBar(metrics)

  expect(result).toHaveLength(3)
  expect(result[0]).toContain("0.950")
  expect(result[1]).toContain("█")
  expect(result[2]).toContain("0.050")
})

test("LivingGlyph - Mathojis", () => {
  const glyph = new LivingGlyph({ size: 5, density: 0.5, symmetry: true })

  expect(glyph.getMathoji("thinking")).toBe("∴")
  expect(glyph.getMathoji("verified")).toBe("⊢")
  expect(glyph.getMathoji("learning")).toBe("∂")
  expect(glyph.getMathoji("optimized")).toBe("∇")
  expect(glyph.getMathoji("stable")).toBe("≡")
  expect(glyph.getMathoji("warning")).toBe("Δ")
  expect(glyph.getMathoji("ready")).toBe("▸")
})

test("LivingGlyph - Startup splash generation", () => {
  const glyph = new LivingGlyph({
    size: 7,
    density: 0.8,
    symmetry: true,
    seed: 42,
  })

  const metrics = {
    performance: {
      latency: 0.21,
      throughput: 1000,
      load: 0.3,
    },
    evolution: {
      generation: 128,
      accuracy: 0.95,
      variance: 0.05,
      entropy: 0.7,
    },
    confidence: {
      probability: 0.991,
      errorNorm: 0.017,
      confidence: 0.98,
    },
  }

  const result = glyph.generateStartupSplash(metrics)

  expect(result.length).toBeGreaterThan(10)
  expect(result.some((line) => line.includes("NEO"))).toBe(true)
  expect(result.some((line) => line.includes("Artificial CLI Intelligence"))).toBe(true)
  expect(result.some((line) => line.includes("perf"))).toBe(true)
  expect(result.some((line) => line.includes("evolution"))).toBe(true)
  expect(result.some((line) => line.includes("accuracy"))).toBe(true)
  expect(result.some((line) => line.includes("ready ▸"))).toBe(true)
})

test("LivingGlyph - Matrix generation properties", () => {
  const glyph = new LivingGlyph({
    size: 10,
    density: 0.8,
    symmetry: true,
    seed: 42,
  })

  const result = glyph.generateCoreGlyph()

  // Check dimensions
  expect(result).toHaveLength(10)
  result.forEach((line) => {
    expect(line.length).toBe(10)
  })

  // Check that only valid block characters are used
  const validBlocks = ["░", "▒", "▓", "█"]
  result.forEach((line) => {
    line.split("").forEach((char) => {
      if (char !== " ") {
        // Allow spaces for labels
        expect(validBlocks).toContain(char)
      }
    })
  })
})

test("LivingGlyph - Entropy bar generation", () => {
  const glyph = new LivingGlyph({ size: 5, density: 0.5, symmetry: true })

  // Test high entropy
  const highEntropy = glyph.generateEvolutionSignal({
    generation: 0,
    accuracy: 0.5,
    variance: 1.0,
    entropy: 1.0,
  })

  // Test low entropy
  const lowEntropy = glyph.generateEvolutionSignal({
    generation: 200,
    accuracy: 0.95,
    variance: 0.05,
    entropy: 0.1,
  })

  // High entropy should have more filled blocks
  const highFilled = (highEntropy.match(/█/g) || []).length
  const lowFilled = (lowEntropy.match(/█/g) || []).length

  expect(highFilled).toBeGreaterThan(lowFilled)
})

test("LivingGlyph - Performance wave variation", () => {
  const glyph = new LivingGlyph({ size: 5, density: 0.5, symmetry: true })

  const fastPerf = glyph.generatePerformanceWave(
    {
      latency: 0.05,
      throughput: 1000,
      load: 0.1,
    },
    8,
  )

  const slowPerf = glyph.generatePerformanceWave(
    {
      latency: 1.0,
      throughput: 100,
      load: 0.8,
    },
    8,
  )

  // Both should contain wave patterns
  expect(fastPerf).toContain("0.05ms")
  expect(slowPerf).toContain("1.00ms")

  // Wave patterns should be different (due to different latency affecting generation)
  expect(fastPerf).not.toBe(slowPerf)
})

test("LivingGlyph - Size variations", () => {
  const sizes = [3, 5, 7, 9, 11]

  sizes.forEach((size) => {
    const glyph = new LivingGlyph({
      size,
      density: 0.7,
      symmetry: true,
      seed: 42,
    })

    const result = glyph.generateCoreGlyph()

    expect(result).toHaveLength(size)
    result.forEach((line) => {
      expect(line.length).toBe(size)
    })
  })
})

test("LivingGlyph - Confidence probability boundaries", () => {
  const glyph = new LivingGlyph({ size: 5, density: 0.5, symmetry: true })

  // Test edge cases
  const minConfidence = glyph.generateConfidenceBar({
    probability: 0.0,
    errorNorm: 1.0,
    confidence: 0.0,
  })

  const maxConfidence = glyph.generateConfidenceBar({
    probability: 1.0,
    errorNorm: 0.0,
    confidence: 1.0,
  })

  // Min confidence should have mostly empty blocks
  expect(minConfidence[1]).toContain("░")

  // Max confidence should have mostly filled blocks
  expect(maxConfidence[1]).toContain("█")
})
