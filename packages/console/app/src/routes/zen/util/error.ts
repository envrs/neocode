export class AuthError extends Error {
  constructor(message: string, public action?: string) {
    super(message)
  }
}

export class CreditsError extends Error {
  constructor(message: string, public action?: string) {
    super(message)
  }
}

export class MonthlyLimitError extends Error {
  constructor(message: string, public action?: string) {
    super(message)
  }
}

export class SubscriptionError extends Error {
  retryAfter?: number
  constructor(message: string, retryAfter?: number, public action?: string) {
    super(message)
    this.retryAfter = retryAfter
  }
}

export class UserLimitError extends Error {
  constructor(message: string, public action?: string) {
    super(message)
  }
}

export class ModelError extends Error {
  constructor(message: string, public action?: string) {
    super(message)
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public action?: string) {
    super(message)
  }
}
