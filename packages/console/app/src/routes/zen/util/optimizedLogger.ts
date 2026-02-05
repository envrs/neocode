import { Resource } from "@neocode-ai/console-resource"

type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type MetricLevel = 'counter' | 'gauge' | 'histogram'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp?: string
  context?: Record<string, any>
}

interface MetricEntry {
  type: MetricLevel
  name: string
  value: number
  timestamp?: string
  labels?: Record<string, string>
}

/**
 * Optimized logger with proper log levels and production safety
 * Eliminates NODE_ENV checks from hot paths
 */
class OptimizedLogger {
  private readonly isProduction: boolean
  private readonly minLogLevel: LogLevel

  constructor() {
    this.isProduction = Resource.App.stage === "production"
    // Set minimum log level based on environment
    this.minLogLevel = this.isProduction ? 'info' : 'debug'
  }

  /**
   * Only logs if level meets minimum threshold
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    }
    return levels[level] >= levels[this.minLogLevel]
  }

  /**
   * Structured logging with consistent field naming (snake_case)
   */
  private log(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const logEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
      service: 'zen-gateway'
    }

    // Use appropriate console method based on level
    switch (entry.level) {
      case 'debug':
        console.debug(JSON.stringify(logEntry))
        break
      case 'info':
        console.info(JSON.stringify(logEntry))
        break
      case 'warn':
        console.warn(JSON.stringify(logEntry))
        break
      case 'error':
        console.error(JSON.stringify(logEntry))
        break
    }
  }

  /**
   * Metrics logging with proper naming conventions
   */
  metric(entry: MetricEntry): void {
    const metricEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date().toISOString(),
      service: 'zen-gateway'
    }

    console.log(`_metric:${JSON.stringify(metricEntry)}`)
  }

  // Convenience methods with proper level checking
  debug(message: string, context?: Record<string, any>): void {
    this.log({ level: 'debug', message, context })
  }

  info(message: string, context?: Record<string, any>): void {
    this.log({ level: 'info', message, context })
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log({ level: 'warn', message, context })
  }

  error(message: string, context?: Record<string, any>): void {
    this.log({ level: 'error', message, context })
  }

  // Specific metric methods with consistent naming
  counter(name: string, value: number = 1, labels?: Record<string, string>): void {
    this.metric({ type: 'counter', name, value, labels })
  }

  gauge(name: string, value: number, labels?: Record<string, string>): void {
    this.metric({ type: 'gauge', name, value, labels })
  }

  histogram(name: string, value: number, labels?: Record<string, string>): void {
    this.metric({ type: 'histogram', name, value, labels })
  }
}

// Export singleton instance
export const logger = new OptimizedLogger()

/**
 * Request timing helper for performance metrics
 */
export class RequestTimer {
  private readonly startTime: number
  private readonly labels: Record<string, string>

  constructor(labels: Record<string, string>) {
    this.startTime = Date.now()
    this.labels = labels
  }

  /**
   * Records request duration and logs as histogram
   */
  record(success: boolean = true): number {
    const duration = Date.now() - this.startTime
    logger.histogram('request_duration_ms', duration, {
      ...this.labels,
      success: success.toString()
    })
    return duration
  }

  /**
   * Records time to first byte for streaming requests
   */
  recordTimeToFirstByte(): number {
    const duration = Date.now() - this.startTime
    logger.histogram('time_to_first_byte_ms', duration, this.labels)
    return duration
  }
}
