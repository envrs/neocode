import { describe, expect, test } from "bun:test"
import path from "path"
import fs from "fs/promises"
import { tmpdir } from "../fixture/fixture"
import { Instance } from "../../src/project/instance"
import { ToolRegistry } from "../../src/tool/registry"

describe("tool.registry", () => {
  test("loads tools from .neocode/tool (singular)", async () => {
    await using tmp = await tmpdir({
      init: async (dir) => {
        const neocodeDir = path.join(dir, ".neocode")
        await fs.mkdir(neocodeDir, { recursive: true })

        const toolDir = path.join(neocodeDir, "tool")
        await fs.mkdir(toolDir, { recursive: true })

        await Bun.write(
          path.join(toolDir, "hello.ts"),
          [
            "export default {",
            "  description: 'hello tool',",
            "  args: {},",
            "  execute: async () => {",
            "    return 'hello world'",
            "  },",
            "}",
            "",
          ].join("\n"),
        )
      },
    })

    await Instance.provide({
      directory: tmp.path,
      fn: async () => {
        const ids = await ToolRegistry.ids()
        expect(ids).toContain("hello")
      },
    })
  })

  test("loads tools from .neocode/tools (plural)", async () => {
    await using tmp = await tmpdir({
      init: async (dir) => {
        const neocodeDir = path.join(dir, ".neocode")
        await fs.mkdir(neocodeDir, { recursive: true })

        const toolsDir = path.join(neocodeDir, "tools")
        await fs.mkdir(toolsDir, { recursive: true })

        await Bun.write(
          path.join(toolsDir, "hello.ts"),
          [
            "export default {",
            "  description: 'hello tool',",
            "  args: {},",
            "  execute: async () => {",
            "    return 'hello world'",
            "  },",
            "}",
            "",
          ].join("\n"),
        )
      },
    })

    await Instance.provide({
      directory: tmp.path,
      fn: async () => {
        const ids = await ToolRegistry.ids()
        expect(ids).toContain("hello")
      },
    })
  })

  test(
    "loads tools with external dependencies without crashing",
    async () => {
      await using tmp = await tmpdir({
        init: async (dir) => {
          const neocodeDir = path.join(dir, ".neocode")
          await fs.mkdir(neocodeDir, { recursive: true })

          const toolsDir = path.join(neocodeDir, "tools")
          await fs.mkdir(toolsDir, { recursive: true })

          await Bun.write(
            path.join(neocodeDir, "package.json"),
            JSON.stringify({
              name: "custom-tools",
              dependencies: {
                "@neocode-ai/plugin": path.join(process.cwd(), "..", "plugin"),
                cowsay: "^1.6.0",
              },
            }),
          )

          await Bun.write(
            path.join(toolsDir, "cowsay.ts"),
            [
              "import { say } from 'cowsay'",
              "export default {",
              "  description: 'tool that imports cowsay at top level',",
              "  args: { text: { type: 'string' } },",
              "  execute: async ({ text }: { text: string }) => {",
              "    return say({ text })",
              "  },",
              "}",
              "",
            ].join("\n"),
          )

          await fs.mkdir(path.join(neocodeDir, "node_modules", "cowsay"), { recursive: true })
          await Bun.write(
            path.join(neocodeDir, "node_modules", "cowsay", "package.json"),
            JSON.stringify({
              name: "cowsay",
              version: "1.6.0",
              main: "index.js",
            }),
          )
          await Bun.write(
            path.join(neocodeDir, "node_modules", "cowsay", "index.js"),
            "exports.say = function(opts) { return 'mock moo ' + opts.text; };",
          )
        },
      })

      await Instance.provide({
        directory: tmp.path,
        fn: async () => {
          const ids = await ToolRegistry.ids()
          expect(ids).toContain("cowsay")
        },
      })
    },
    { timeout: 30000 },
  )
})
