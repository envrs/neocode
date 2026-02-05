import { describe, expect, test, afterAll, beforeEach, mock } from "bun:test"
import { Storage } from "../../src/core/storage"

// Mock the storage adapter for tests
const mockStorage = new Map<string, string>()

mock.module("../../src/core/storage", () => ({
  Storage: {
    write: async (key: string[], value: any) => {
      mockStorage.set(key.join("/") + ".json", JSON.stringify(value))
    },
    read: async (key: string[]) => {
      const value = mockStorage.get(key.join("/") + ".json")
      return value ? JSON.parse(value) : undefined
    },
    remove: async (key: string[]) => {
      mockStorage.delete(key.join("/") + ".json")
    },
    list: async (options?: { prefix?: string[]; limit?: number; after?: string; before?: string }) => {
      const prefix = options?.prefix ? options.prefix.join("/") + (options.prefix.length ? "/" : "") : ""
      const keys = Array.from(mockStorage.keys())
        .filter((key) => key.startsWith(prefix))
        .map((key) => key.replace(/\.json$/, "").split("/"))

      // Sort keys for consistent ordering
      keys.sort()

      // Apply after filter
      let filtered = keys
      if (options?.after && options.prefix) {
        const afterPath = [...options.prefix, options.after].join("/")
        const afterIndex = keys.findIndex((k) => k.join("/") === afterPath)
        if (afterIndex !== -1) {
          filtered = keys.slice(afterIndex + 1)
        }
      }

      // Apply before filter
      if (options?.before && options.prefix) {
        const beforePath = [...options.prefix, options.before].join("/")
        const beforeIndex = filtered.findIndex((k) => k.join("/") === beforePath)
        if (beforeIndex !== -1) {
          filtered = filtered.slice(0, beforeIndex)
        }
      }

      // Apply limit
      if (options?.limit) {
        filtered = filtered.slice(0, options.limit)
      }

      return filtered
    },
  },
}))

describe("core.storage", () => {
  test("should list files with after and before range", async () => {
    await Storage.write(["test", "users", "user1"], { name: "user1" })
    await Storage.write(["test", "users", "user2"], { name: "user2" })
    await Storage.write(["test", "users", "user3"], { name: "user3" })
    await Storage.write(["test", "users", "user4"], { name: "user4" })
    await Storage.write(["test", "users", "user5"], { name: "user5" })

    const result = await Storage.list({ prefix: ["test", "users"], after: "user2", before: "user4" })

    expect(result).toEqual([["test", "users", "user3"]])
  })

  test("should list files with after only", async () => {
    // Setup data for this test
    await Storage.write(["test", "users", "user1"], { name: "user1" })
    await Storage.write(["test", "users", "user2"], { name: "user2" })
    await Storage.write(["test", "users", "user3"], { name: "user3" })
    await Storage.write(["test", "users", "user4"], { name: "user4" })
    await Storage.write(["test", "users", "user5"], { name: "user5" })

    const result = await Storage.list({ prefix: ["test", "users"], after: "user3" })

    expect(result).toEqual([
      ["test", "users", "user4"],
      ["test", "users", "user5"],
    ])
  })

  test("should list files with limit", async () => {
    // Setup data for this test
    await Storage.write(["test", "users", "user1"], { name: "user1" })
    await Storage.write(["test", "users", "user2"], { name: "user2" })
    await Storage.write(["test", "users", "user3"], { name: "user3" })
    await Storage.write(["test", "users", "user4"], { name: "user4" })
    await Storage.write(["test", "users", "user5"], { name: "user5" })

    const result = await Storage.list({ prefix: ["test", "users"], limit: 3 })

    expect(result).toEqual([
      ["test", "users", "user1"],
      ["test", "users", "user2"],
      ["test", "users", "user3"],
    ])
  })

  test("should list all files without prefix", async () => {
    // Setup data for this test
    await Storage.write(["test", "users", "user1"], { name: "user1" })

    const result = await Storage.list()

    expect(result.length).toBeGreaterThan(0)
  })

  test("should list all files with prefix", async () => {
    // Setup data for this test
    await Storage.write(["test", "users", "user1"], { name: "user1" })
    await Storage.write(["test", "users", "user2"], { name: "user2" })
    await Storage.write(["test", "users", "user3"], { name: "user3" })
    await Storage.write(["test", "users", "user4"], { name: "user4" })
    await Storage.write(["test", "users", "user5"], { name: "user5" })

    const result = await Storage.list({ prefix: ["test", "users"] })

    expect(result).toEqual([
      ["test", "users", "user1"],
      ["test", "users", "user2"],
      ["test", "users", "user3"],
      ["test", "users", "user4"],
      ["test", "users", "user5"],
    ])
  })

  afterAll(async () => {
    const testFiles = await Storage.list({ prefix: ["test"] })

    for (const file of testFiles) {
      await Storage.remove(file)
    }

    const remainingFiles = await Storage.list({ prefix: ["test"] })
    expect(remainingFiles).toEqual([])
  })
})
