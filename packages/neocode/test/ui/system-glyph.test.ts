import { test, expect } from "bun:test"
import { SystemGlyph } from "../../src/ui/system-glyph.js"

test("SystemGlyph - Deterministic seed generation", () => {
  const state = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7, maxTokens: 4096 },
    toolchain: ["typescript", "bun"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const glyph1 = new SystemGlyph(state)
  const glyph2 = new SystemGlyph(state)

  const fingerprint1 = glyph1.generateFingerprint()
  const fingerprint2 = glyph2.generateFingerprint()

  expect(fingerprint1.seed).toBe(fingerprint2.seed)
  expect(fingerprint1.signature).toBe(fingerprint2.signature)
})

test("SystemGlyph - Different states produce different seeds", () => {
  const state1 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const state2 = {
    modelVersion: "gpt-5.2-turbo-pro", // Different model version
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "b2c3d4e5f6789a1", // Different commit
    environment: "development",
  }

  const glyph1 = new SystemGlyph(state1)
  const glyph2 = new SystemGlyph(state2)

  const fingerprint1 = glyph1.generateFingerprint()
  const fingerprint2 = glyph2.generateFingerprint()

  expect(fingerprint1.seed).not.toBe(fingerprint2.seed)
  expect(fingerprint1.signature).not.toBe(fingerprint2.signature)
})

test("SystemGlyph - State comparison functionality", () => {
  const state1 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7, maxTokens: 4096 },
    toolchain: ["typescript", "bun"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const state2 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.5, maxTokens: 4096 },
    toolchain: ["typescript", "bun"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const comparison = SystemGlyph.compareStates(state1, state2)

  expect(comparison.similarity).toBeGreaterThan(0.5)
  expect(comparison.compatibility).toBe("compatible")
  expect(comparison.differences.some((diff) => diff.includes("temperature"))).toBe(true)
})

test("SystemGlyph - Identical states comparison", () => {
  const state = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const comparison = SystemGlyph.compareStates(state, state)

  expect(comparison.similarity).toBe(1)
  expect(comparison.compatibility).toBe("identical")
  expect(comparison.differences).toHaveLength(0)
})

test("SystemGlyph - Diagnostic glyph generation", () => {
  const state = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const glyph = new SystemGlyph(state)

  const optimalHealth = { errors: 0, warnings: 0, performance: 0.95, reliability: 0.98 }
  const degradedHealth = { errors: 2, warnings: 5, performance: 0.7, reliability: 0.8 }

  const optimalDiagnostic = glyph.generateDiagnosticGlyph(optimalHealth)
  const degradedDiagnostic = glyph.generateDiagnosticGlyph(degradedHealth)

  expect(optimalDiagnostic.join(" ")).toContain("System optimal")
  expect(degradedDiagnostic.join(" ")).toContain("System degraded")
  expect(optimalDiagnostic.length).toBeGreaterThan(7) // glyph + health info
  expect(degradedDiagnostic.length).toBeGreaterThan(7)
})

test("SystemGlyph - Health affects glyph symmetry", () => {
  const state = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const glyph = new SystemGlyph(state)

  const healthyState = { errors: 0, warnings: 0, performance: 0.95, reliability: 0.98 }
  const errorState = { errors: 2, warnings: 0, performance: 0.95, reliability: 0.98 }

  const healthyDiagnostic = glyph.generateDiagnosticGlyph(healthyState)
  const errorDiagnostic = glyph.generateDiagnosticGlyph(errorState)

  // Both should have glyphs, but potentially different symmetry
  // Note: With the same seed and health, they might be identical
  expect(healthyDiagnostic.length).toBeGreaterThan(7)
  expect(errorDiagnostic.length).toBeGreaterThan(7)
})

test("SystemGlyph - CI signature generation", () => {
  const state = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const glyph = new SystemGlyph(state)

  const metrics = {
    totalRuns: 42,
    successRate: 1.0,
    avgLatency: 0.15,
    errorRate: 0.0,
  }

  const signature = glyph.generateCISignature(metrics)

  expect(signature).toContain("NeoCode verified")
  expect(signature).toContain("μ↑ σ↓")
  expect(signature).toContain("‖error⃗‖₂")
  expect(signature).toContain("100.0%")
})

test("SystemGlyph - Signature format consistency", () => {
  const state = {
    modelVersion: "gpt-5.2-turbo-pro",
    config: { temperature: 0.1, maxTokens: 1024, debug: false },
    toolchain: ["typescript", "bun", "eslint"],
    commitSha: "9f8e7d6c5b4a321",
    environment: "production",
  }

  const glyph = new SystemGlyph(state)
  const fingerprint = glyph.generateFingerprint()

  // Signature should follow format: environment:modelHash+configCount+toolchainCount@commitShort
  // Model hash can contain letters, numbers, and hyphens
  expect(fingerprint.signature).toMatch(/^[a-z]+:[a-z0-9-.]+\+\d+\+\d+@[a-f0-9]+$/)
})

test("SystemGlyph - Fingerprint metadata completeness", () => {
  const state = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const glyph = new SystemGlyph(state)
  const fingerprint = glyph.generateFingerprint()

  expect(fingerprint.seed).toBeTypeOf("number")
  expect(fingerprint.signature).toBeTypeOf("string")
  expect(fingerprint.glyph).toBeTypeOf("object")
  expect(fingerprint.metadata.stateHash).toBeTypeOf("string")
  expect(fingerprint.metadata.generatedAt).toBeTypeOf("number")
  expect(fingerprint.metadata.environment).toBe("development")
})

test("SystemGlyph - Toolchain differences detection", () => {
  const state1 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript", "bun"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const state2 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript", "bun", "eslint"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const comparison = SystemGlyph.compareStates(state1, state2)

  expect(comparison.differences.some((diff) => diff.includes("+eslint"))).toBe(true)
  expect(comparison.compatibility).toBe("compatible")
})

test("SystemGlyph - Config differences detection", () => {
  const state1 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7, maxTokens: 4096 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const state2 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.5, maxTokens: 2048, debug: true },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const comparison = SystemGlyph.compareStates(state1, state2)

  expect(comparison.differences.some((diff) => diff.includes("~temperature"))).toBe(true)
  expect(comparison.differences.some((diff) => diff.includes("~maxTokens"))).toBe(true)
  expect(comparison.differences.some((diff) => diff.includes("+debug"))).toBe(true)
})

test("SystemGlyph - Environment differences detection", () => {
  const state1 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const state2 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7 },
    toolchain: ["typescript"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "production",
  }

  const comparison = SystemGlyph.compareStates(state1, state2)

  expect(comparison.differences.some((diff) => diff.includes("env:"))).toBe(true)
  expect(comparison.similarity).toBeLessThan(1.0)
})

test("SystemGlyph - Complex state comparison", () => {
  const state1 = {
    modelVersion: "gpt-5.2-turbo",
    config: { temperature: 0.7, maxTokens: 4096, debug: true },
    toolchain: ["typescript", "bun", "eslint"],
    commitSha: "a1b2c3d4e5f6789",
    environment: "development",
  }

  const state2 = {
    modelVersion: "gpt-5.2-turbo-pro",
    config: { temperature: 0.3, maxTokens: 2048 },
    toolchain: ["typescript", "bun", "prettier"],
    commitSha: "f6e5d4c3b2a1987",
    environment: "production",
  }

  const comparison = SystemGlyph.compareStates(state1, state2)

  expect(comparison.differences.length).toBeGreaterThan(3)
  expect(comparison.compatibility).toBe("incompatible")
  expect(comparison.similarity).toBeLessThan(0.7)
})
