import { env } from "cloudflare:workers"
export { waitUntil } from "cloudflare:workers"

export const Resource = new Proxy(
  {},
  {
    get(_target, prop: string) {
      // @ts-expect-error
      const value = env[prop] || (prop === "App" ? env.App : undefined)
      if (value === undefined) {
        throw new Error(`"${prop}" is not linked in your configuration`)
      }

      if (typeof value === "string") {
        try {
          return JSON.parse(value)
        } catch {
          return { value }
        }
      }
      return value
    },
  },
) as Record<string, any>
