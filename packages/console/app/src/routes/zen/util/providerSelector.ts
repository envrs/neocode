import { ZenData } from "@neocode-ai/console-core/model.js"
import { ModelError } from "./error"

type ProviderInfo = {
  id: string
  weight?: number
  disabled?: boolean
}

type SelectionContext = {
  model: string
  providers: ProviderInfo[]
  sessionId: string
  isTrial: boolean
  stickyProvider?: string
  byokProvider?: string
  trialProvider?: string
  fallbackProvider?: string
  excludeProviders: string[]
  retryCount: number
  maxRetries: number
}

/**
 * Optimized provider selection with weighted random distribution
 * Replaces complex hashing algorithm with efficient weighted selection
 */
export function selectProvider(context: SelectionContext): string {
  // Priority 1: BYOK (Bring Your Own Key) provider
  if (context.byokProvider && !context.excludeProviders.includes(context.byokProvider)) {
    const provider = context.providers.find(p => p.id === context.byokProvider)
    if (provider && !provider.disabled) return provider.id
  }

  // Priority 2: Trial provider
  if (context.isTrial && context.trialProvider && !context.excludeProviders.includes(context.trialProvider)) {
    const provider = context.providers.find(p => p.id === context.trialProvider)
    if (provider && !provider.disabled) return provider.id
  }

  // Priority 3: Sticky provider (session affinity)
  if (context.stickyProvider && !context.excludeProviders.includes(context.stickyProvider)) {
    const provider = context.providers.find(p => p.id === context.stickyProvider)
    if (provider && !provider.disabled) return provider.id
  }

  // Priority 4: Fallback provider (max retries reached)
  if (context.retryCount >= context.maxRetries && context.fallbackProvider) {
    const provider = context.providers.find(p => p.id === context.fallbackProvider)
    if (provider && !provider.disabled) return provider.id
  }

  // Priority 5: Weighted random selection from available providers
  const availableProviders = context.providers.filter(p => 
    !p.disabled && !context.excludeProviders.includes(p.id)
  )

  if (availableProviders.length === 0) {
    throw new ModelError("No available providers")
  }

  return weightedRandomSelect(availableProviders)
}

/**
 * Efficient weighted random selection using cumulative weights
 * O(n) time complexity, O(1) space complexity
 */
function weightedRandomSelect(providers: ProviderInfo[]): string {
  // Calculate total weight
  const totalWeight = providers.reduce((sum, provider) => sum + (provider.weight || 1), 0)
  
  // Generate random number between 0 and totalWeight
  const random = Math.random() * totalWeight
  
  // Find provider based on cumulative weight
  let cumulativeWeight = 0
  for (const provider of providers) {
    cumulativeWeight += provider.weight || 1
    if (random <= cumulativeWeight) {
      return provider.id
    }
  }
  
  // Fallback to last provider (shouldn't happen due to floating point precision)
  return providers[providers.length - 1].id
}

/**
 * Validates provider selection context
 */
export function validateSelectionContext(context: SelectionContext): void {
  if (!context.model || typeof context.model !== 'string') {
    throw new ModelError("Invalid model identifier")
  }
  
  if (!Array.isArray(context.providers) || context.providers.length === 0) {
    throw new ModelError("No providers configured")
  }
  
  if (context.retryCount < 0 || context.maxRetries < 0) {
    throw new ModelError("Invalid retry configuration")
  }
  
  if (context.retryCount > context.maxRetries) {
    throw new ModelError("Maximum retries exceeded")
  }
}
