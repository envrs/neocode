import { ModelError } from "./error"

export interface RequestValidation {
  model: string
  sessionId: string
  requestId: string
  projectId: string
  isStream: boolean
  bodySize: number
}

const MAX_MODEL_NAME_LENGTH = 100
const MAX_SESSION_ID_LENGTH = 255
const MAX_REQUEST_ID_LENGTH = 255
const MAX_PROJECT_ID_LENGTH = 100
const MAX_BODY_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Validates incoming request parameters for security and bounds checking
 */
export function validateRequest(validation: RequestValidation): void {
  // Validate model name
  if (!validation.model || typeof validation.model !== "string") {
    throw new ModelError("Model name is required and must be a string")
  }
  if (validation.model.length > MAX_MODEL_NAME_LENGTH) {
    throw new ModelError(`Model name too long (max ${MAX_MODEL_NAME_LENGTH} characters)`)
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(validation.model)) {
    throw new ModelError("Model name contains invalid characters")
  }

  // Validate session ID
  if (validation.sessionId && typeof validation.sessionId === "string") {
    if (validation.sessionId.length > MAX_SESSION_ID_LENGTH) {
      throw new ModelError(`Session ID too long (max ${MAX_SESSION_ID_LENGTH} characters)`)
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(validation.sessionId)) {
      throw new ModelError("Session ID contains invalid characters")
    }
  }

  // Validate request ID
  if (validation.requestId && typeof validation.requestId === "string") {
    if (validation.requestId.length > MAX_REQUEST_ID_LENGTH) {
      throw new ModelError(`Request ID too long (max ${MAX_REQUEST_ID_LENGTH} characters)`)
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(validation.requestId)) {
      throw new ModelError("Request ID contains invalid characters")
    }
  }

  // Validate project ID
  if (validation.projectId && typeof validation.projectId === "string") {
    if (validation.projectId.length > MAX_PROJECT_ID_LENGTH) {
      throw new ModelError(`Project ID too long (max ${MAX_PROJECT_ID_LENGTH} characters)`)
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(validation.projectId)) {
      throw new ModelError("Project ID contains invalid characters")
    }
  }

  // Validate body size
  if (validation.bodySize > MAX_BODY_SIZE) {
    throw new ModelError(`Request body too large (max ${MAX_BODY_SIZE} bytes)`)
  }

  // Validate stream flag
  if (typeof validation.isStream !== "boolean") {
    throw new ModelError("Stream flag must be boolean")
  }
}

/**
 * Sanitizes and extracts request metadata
 */
export function extractRequestMetadata(url: string, body: any, headers: Headers): RequestValidation {
  const contentLength = headers.get("content-length")
  const bodySize = contentLength ? parseInt(contentLength, 10) : 0

  return {
    model: body?.model || "",
    sessionId: headers.get("x-neocode-session") || "",
    requestId: headers.get("x-neocode-request") || "",
    projectId: headers.get("x-neocode-project") || "",
    isStream: !!body?.stream,
    bodySize,
  }
}
