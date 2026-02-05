import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./migrations/",
  strict: true,
  schema: ["./src/**/*.sql.ts"],
  verbose: true,
  dialect: "mysql",
  dbCredentials: {
    database: process.env.DATABASE_NAME!,
    host: process.env.DATABASE_HOST!,
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    port: parseInt(process.env.DATABASE_PORT || "3306"),
    ssl: {
      rejectUnauthorized: false,
    },
  },
})
