/**
 * General metrics interfaces
 */
export interface Metric {
    name: string
    value: number
    tags: Record<string, string>
    timestamp: string
}

export class MetricsCollector {
    private metrics: Metric[] = []

    public record(name: string, value: number, tags: Record<string, string> = {}) {
        this.metrics.push({
            name,
            value,
            tags,
            timestamp: new Date().toISOString(),
        })
    }

    public flush(): Metric[] {
        const current = [...this.metrics]
        this.metrics = []
        // Route to Datadog / Prometheus / OTLP
        return current
    }
}
