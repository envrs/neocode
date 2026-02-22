import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "sqlite",
  schema: "../../packages/db/src/schema/index.ts",
  out: "../../packages/db/migrations",
  dbCredentials: {
    url: "/home/khulnasoft/.local/share/neocode/neocode.db",
  },
})
