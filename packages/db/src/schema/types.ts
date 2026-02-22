export namespace DBTypes {
  export interface FileDiff {
    file: string
    before: string
    after: string
    additions: number
    deletions: number
    status?: "added" | "deleted" | "modified"
  }

  export interface Rule {
    permission: string
    pattern: string
    action: "allow" | "deny" | "ask"
  }

  export type Ruleset = Rule[]

  export interface ProjectCommands {
    start?: string
  }
}
