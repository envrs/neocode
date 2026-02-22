import type { WebhookPayload } from "./hooks"
import { suggestRemediation, type RemediationPlan } from "./remediation"

export interface IncidentClassification {
    severity: "low" | "medium" | "high" | "critical"
    category: "infrastructure" | "application" | "security" | "network" | "unknown"
}

/**
 * Automates the pipeline taking an external incident, classifying it,
 * and generating an AI-driven remediation plan.
 */
export async function processIncidentPipeline(payload: WebhookPayload): Promise<{
    classification: IncidentClassification
    remediation: RemediationPlan
}> {
    // Classification logic stub
    const isCriticalError = JSON.stringify(payload).includes("Timeout")
    const severity = isCriticalError ? "critical" : "medium"
    const classification: IncidentClassification = {
        severity,
        category: "application",
    }

    // LLM suggests remediation
    const remediation = await suggestRemediation(payload.data)

    return { classification, remediation }
}
