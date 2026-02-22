import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { Timestamps } from "./storage"
import type { DBTypes } from "./types"

export const ProjectTable = sqliteTable("project", {
  id: text().primaryKey(),
  worktree: text().notNull(),
  vcs: text(),
  name: text(),
  icon_url: text(),
  icon_color: text(),
  ...Timestamps,
  time_initialized: integer(),
  sandboxes: text({ mode: "json" }).notNull().$type<string[]>(),
  commands: text({ mode: "json" }).$type<DBTypes.ProjectCommands>(),
})
