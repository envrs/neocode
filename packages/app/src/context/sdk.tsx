import type { Event, NeocodeClient } from "@neocode-ai/sdk/v2/client"
import { createSimpleContext } from "@neocode-ai/ui/context"
import { type Emitter, createGlobalEmitter } from "@solid-primitives/event-bus"
import { type Accessor, createEffect, createMemo, onCleanup } from "solid-js"
import { useGlobalSDK } from "./global-sdk"

import type { GlobalSDKContext } from "./global-sdk"

type SDKEventMap = {
  [key in Event["type"]]: Extract<Event, { type: key }>
}

export interface SDKContext {
  directory: string
  client: NeocodeClient
  event: any
  url: string
  createClient(opts: Parameters<GlobalSDKContext["createClient"]>[0]): NeocodeClient
}

export const { use: useSDK, provider: SDKProvider } = createSimpleContext<SDKContext, { directory: Accessor<string> }>({
  name: "SDK",
  init: (props: { directory: Accessor<string> }) => {
    const globalSDK = useGlobalSDK()

    const directory = createMemo(props.directory)
    const client = createMemo(() =>
      globalSDK.createClient({
        directory: directory(),
        throwOnError: true,
      }),
    )

    const emitter = createGlobalEmitter<SDKEventMap>()

    createEffect(() => {
      const unsub = globalSDK.event.on(directory(), (event: any) => {
        emitter.emit(event.type, event)
      })
      onCleanup(unsub)
    })

    return {
      get directory() {
        return directory()
      },
      get client() {
        return client()
      },
      event: emitter,
      get url() {
        return globalSDK.url
      },
      createClient(opts: Parameters<typeof globalSDK.createClient>[0]) {
        return globalSDK.createClient(opts)
      },
    }
  },
})
