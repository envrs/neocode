import type { KVNamespaceListOptions, KVNamespaceListResult, KVNamespacePutOptions } from "@cloudflare/workers-types"
import Cloudflare from "cloudflare"

export const waitUntil = async (promise: Promise<any>) => {
  await promise
}

export const Resource = new Proxy(
  {},
  {
    get(_target, prop: string) {
      const value = process.env[prop]
      if (value === undefined) return undefined

      try {
        const parsed = JSON.parse(value)
        return parsed
      } catch {
        return { value }
      }
    },
  },
) as Record<string, any>
