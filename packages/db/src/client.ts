import { Database as BunDatabase } from "bun:sqlite"
import { drizzle, type SQLiteBunDatabase } from "drizzle-orm/bun-sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { type SQLiteTransaction } from "drizzle-orm/sqlite-core"
import * as schema from "./schema"

export * from "drizzle-orm"

export namespace Database {
    export type Schema = typeof schema
    export type Transaction = SQLiteTransaction<"sync", void, Schema>
    export type Client = SQLiteBunDatabase<Schema>
    export type TxOrDb = Transaction | Client

    export function create(config: { path: string; journal?: { sql: string; timestamp: number }[] }) {
        const sqlite = new BunDatabase(config.path, { create: true })

        sqlite.run("PRAGMA journal_mode = WAL")
        sqlite.run("PRAGMA synchronous = NORMAL")
        sqlite.run("PRAGMA busy_timeout = 5000")
        sqlite.run("PRAGMA foreign_keys = ON")

        const db = drizzle({ client: sqlite, schema })

        if (config.journal && config.journal.length > 0) {
            migrate(db, config.journal)
        }

        return db
    }
}
