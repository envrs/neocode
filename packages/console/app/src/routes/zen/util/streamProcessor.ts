/**
 * Safe streaming processor with memory limits and proper cleanup
 * Prevents memory leaks and unbounded buffer growth
 */

const MAX_BUFFER_SIZE = 1024 * 1024 // 1MB max buffer
const MAX_CHUNK_SIZE = 64 * 1024 // 64KB max chunk size

export interface StreamProcessor {
  processChunk(value: Uint8Array): string | null
  finalize(): void
  getBufferSize(): number
}

export function createStreamProcessor(
  streamSeparator: string,
  onPart: (part: string) => void,
  onError: (error: Error) => void,
): StreamProcessor {
  let buffer = ""
  let totalSize = 0

  return {
    processChunk(value: Uint8Array): string | null {
      try {
        // Validate chunk size
        if (value.length > MAX_CHUNK_SIZE) {
          throw new Error(`Chunk too large: ${value.length} bytes (max ${MAX_CHUNK_SIZE})`)
        }

        const decoder = new TextDecoder()
        const chunk = decoder.decode(value, { stream: true })

        // Check buffer size limit
        if (totalSize + chunk.length > MAX_BUFFER_SIZE) {
          throw new Error(`Buffer overflow: ${totalSize + chunk.length} bytes (max ${MAX_BUFFER_SIZE})`)
        }

        buffer += chunk
        totalSize += chunk.length

        const parts = buffer.split(streamSeparator)
        buffer = parts.pop() || ""

        let processedPart: string | null = null
        for (const part of parts) {
          const trimmedPart = part.trim()
          if (trimmedPart) {
            onPart(trimmedPart)
            processedPart = trimmedPart
          }
        }

        return processedPart
      } catch (error) {
        onError(error as Error)
        return null
      }
    },

    finalize(): void {
      // Process any remaining buffer content
      if (buffer.trim()) {
        try {
          onPart(buffer.trim())
        } catch (error) {
          onError(error as Error)
        }
      }
      buffer = ""
      totalSize = 0
    },

    getBufferSize(): number {
      return totalSize
    },
  }
}

/**
 * Backpressure-aware stream transformer
 */
export function createBackpressureTransformer(
  processor: StreamProcessor,
  maxQueueSize: number = 100,
): TransformStream<Uint8Array, string> {
  let queue: string[] = []
  let controller: TransformStreamDefaultController<string>

  return new TransformStream({
    start(ctrl) {
      controller = ctrl
    },

    transform(chunk) {
      const part = processor.processChunk(chunk)
      if (part) {
        queue.push(part)

        // Apply backpressure if queue is full
        if (queue.length >= maxQueueSize) {
          throw new Error("Stream queue overflow - applying backpressure")
        }
      }
    },

    flush() {
      // Flush remaining data
      processor.finalize()

      // Enqueue all queued parts
      while (queue.length > 0) {
        const part = queue.shift()
        if (part) {
          controller.enqueue(part)
        }
      }
    },
  })
}
