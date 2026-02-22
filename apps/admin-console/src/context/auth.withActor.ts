import { Actor } from "@neocode-ai/svc-core-console/actor.js"
import { getActor } from "./auth"

export async function withActor<T>(fn: () => T, workspace?: string) {
  const actor = await getActor(workspace)
  return Actor.provide(actor.type, actor.properties, fn)
}
