export * from "./client.js"
export * from "./server.js"

import { createNeocodeClient } from "./client.js"
import { createNeocodeServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createNeocode(options?: ServerOptions) {
  const server = await createNeocodeServer({
    ...options,
  })

  const client = createNeocodeClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
