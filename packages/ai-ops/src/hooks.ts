import { z } from "zod"

export interface WebhookPayload {
    source: "github" | "sentry" | "datadog" | "custom"
    event: string
    timestamp: string
    data: Record<string, unknown>
}

export const WebhookSchema = z.object({
    source: z.enum(["github", "sentry", "datadog", "custom"]),
    event: z.string(),
    timestamp: z.string(),
    data: z.record(z.string(), z.unknown()),
})

export type HookHandler = (payload: WebhookPayload) => Promise<void>

export class HookRegistry {
    private handlers = new Map<string, HookHandler[]>()

    public register(source: string, handler: HookHandler) {
        const existing = this.handlers.get(source) || []
        this.handlers.set(source, [...existing, handler])
    }

    public async dispatch(payload: WebhookPayload) {
        const sourceHandlers = this.handlers.get(payload.source) || []
        for (const handler of sourceHandlers) {
            await handler(payload)
        }
    }
}
