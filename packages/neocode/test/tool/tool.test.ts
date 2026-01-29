import { describe, expect, test } from "bun:test"
import { App } from "../../src/app/app"
import { GlobTool } from "../../src/tool/glob"
import { ListTool } from "../../src/tool/ls"

const ctx = {
  sessionID: "test",
  messageID: "",
  abort: AbortSignal.any([]),
  metadata: () => {},
}
const glob = await GlobTool.init()
const list = await ListTool.init()

describe("tool.glob", () => {
  test("truncate", async () => {
    await App.provide({ cwd: process.cwd() }, async () => {
      let result = await glob.execute(
        {
          pattern: "**/*.ts",
          path: "packages",
        },
        ctx,
      )
      expect(result.metadata.truncated).toBe(true)
    })
  })
  test("basic", async () => {
    await App.provide({ cwd: process.cwd() }, async () => {
      let result = await glob.execute(
        {
          pattern: "*.json",
          path: undefined,
        },
        ctx,
      )
      expect(result.metadata).toMatchObject({
        truncated: false,
        count: 88,
      })
    })
  })
})

describe("tool.ls", () => {
  test("basic", async () => {
    const result = await App.provide({ cwd: process.cwd() }, async () => {
      return await list.execute({ path: "./example", ignore: [".git"] }, ctx)
    })
    const expectedPath = `${process.cwd()}/example/`
    expect(result.output).toBe(`${expectedPath}\n  README.md\n`)
  })
})
