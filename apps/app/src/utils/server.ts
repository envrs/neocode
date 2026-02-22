import { createNeocodeClient, type NeocodeClient } from "@neocode-ai/sdk/v2/client"
import type { ServerConnection } from "@/context/server"

export function createSdkForServer({
  server,
  ...config
}: Omit<NonNullable<Parameters<typeof createNeocodeClient>[0]>, "baseUrl"> & {
  server: ServerConnection.HttpBase
}): NeocodeClient {
  const auth = (() => {
    if (!server.password) return
    return {
      Authorization: `Basic ${btoa(`${server.username ?? "neocode"}:${server.password}`)}`,
    }
  })()

  return createNeocodeClient({
    ...config,
    headers: { ...config.headers, ...auth },
    baseUrl: server.url,
  })
}
