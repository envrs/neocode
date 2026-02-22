export interface LogEntry {
  level: "debug" | "info" | "warn" | "error" | "fatal"
  message: string
  timestamp: string
  context?: Record<string, unknown>
  traceId?: string
}

export type LogHandler = (entry: LogEntry) => void

export class Logger {
  private handlers: LogHandler[] = []

  constructor(private defaultContext: Record<string, unknown> = {}) {}

  public addHandler(handler: LogHandler) {
    this.handlers.push(handler)
  }

  private dispatch(level: LogEntry["level"], message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.defaultContext, ...context },
    }
    for (const handler of this.handlers) {
      handler(entry)
    }
  }

  info(msg: string, ctx?: Record<string, unknown>) {
    this.dispatch("info", msg, ctx)
  }
  error(msg: string, ctx?: Record<string, unknown>) {
    this.dispatch("error", msg, ctx)
  }
  warn(msg: string, ctx?: Record<string, unknown>) {
    this.dispatch("warn", msg, ctx)
  }
  debug(msg: string, ctx?: Record<string, unknown>) {
    this.dispatch("debug", msg, ctx)
  }
}
