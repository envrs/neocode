import type { KVNamespaceListOptions, KVNamespaceListResult, KVNamespacePutOptions } from "@cloudflare/workers-types"
import Cloudflare from "cloudflare"

export const waitUntil = async (promise: Promise<any>) => {
  await promise
}

export const Resource = new Proxy(
  {},
  {
    get(_target, prop: string) {
      const value = (process.env as any)[prop]

      // If the value is a string that looks like JSON, parse it
      // (This mimics SST's behavior for some resources)
      if (typeof value === "string" && (value.startsWith("{") || value.startsWith("["))) {
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      }

      // Handle simple values
      if (value !== undefined) return value

      // Special handling for things that used to be SST resources
      // but are now just env vars
      return {
        value: (process.env as any)[prop],
      }
    },
  },
) as Record<string, any>
