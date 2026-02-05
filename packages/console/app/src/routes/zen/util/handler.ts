import type { APIEvent } from "@solidjs/start/server"
import { and, Database, eq, isNull, lt, or, sql } from "@neocode-ai/console-core/drizzle/index.js"
import { KeyTable } from "@neocode-ai/console-core/schema/key.sql.js"
import { BillingTable, SubscriptionTable, UsageTable } from "@neocode-ai/console-core/schema/billing.sql.js"
import { centsToMicroCents } from "@neocode-ai/console-core/util/price.js"
import { getWeekBounds } from "@neocode-ai/console-core/util/date.js"
import { Identifier } from "@neocode-ai/console-core/identifier.js"
import { Billing } from "@neocode-ai/console-core/billing.js"
import { Actor } from "@neocode-ai/console-core/actor.js"
import { WorkspaceTable } from "@neocode-ai/console-core/schema/workspace.sql.js"
import { ZenData } from "@neocode-ai/console-core/model.js"
import { Black, BlackData } from "@neocode-ai/console-core/black.js"
import { UserTable } from "@neocode-ai/console-core/schema/user.sql.js"
import { ModelTable } from "@neocode-ai/console-core/schema/model.sql.js"
import { ProviderTable } from "@neocode-ai/console-core/schema/provider.sql.js"
import { logger, RequestTimer } from "./optimizedLogger"
import { validateRequest, extractRequestMetadata } from "./requestValidator"
import { selectProvider as optimizedSelectProvider, validateSelectionContext } from "./providerSelector"
import { zenConfig } from "./config"
import { createStreamProcessor, createBackpressureTransformer } from "./streamProcessor"
import { createBodyConverter, createStreamPartConverter, createResponseConverter, UsageInfo } from "./provider/provider"
import { anthropicHelper } from "./provider/anthropic"
import { googleHelper } from "./provider/google"
import { openaiHelper } from "./provider/openai"
import { oaCompatHelper } from "./provider/openai-compatible"
import {
  AuthError,
  CreditsError,
  MonthlyLimitError,
  SubscriptionError,
  UserLimitError,
  ModelError,
  RateLimitError,
} from "./error"
import { createRateLimiter } from "./rateLimiter"
import { createDataDumper } from "./dataDumper"
import { createTrialLimiter } from "./trialLimiter"

import { createStickyTracker } from "./stickyProviderTracker"
type ZenData = Awaited<ReturnType<typeof ZenData.list>>
type RetryOptions = {
  excludeProviders: string[]
  retryCount: number
}

export async function handler(
  input: APIEvent,
  opts: {
    format: ZenData.Format
    parseApiKey: (headers: Headers) => string | undefined
    parseModel: (url: string, body: any) => string
    parseIsStream: (url: string, body: any) => boolean
  },
) {
  type AuthInfo = Awaited<ReturnType<typeof authenticate>>
  type ModelInfo = Awaited<ReturnType<typeof validateModel>>
  type ProviderInfo = Awaited<ReturnType<typeof selectProvider>>

  const MAX_RETRIES = zenConfig.maxRetries
  const FREE_WORKSPACES = zenConfig.freeWorkspaces

  let model = "unknown"
  try {
    const url = input.request.url
    const body = await input.request.json()
    model = opts.parseModel(url, body)
    const isStream = opts.parseIsStream(url, body)
    const ip = input.request.headers.get("x-real-ip") ?? ""
    const sessionId = input.request.headers.get("x-neocode-session") ?? ""
    const requestId = input.request.headers.get("x-neocode-request") ?? ""
    const projectId = input.request.headers.get("x-neocode-project") ?? ""
    const ocClient = input.request.headers.get("x-neocode-client") ?? ""

    // Validate request parameters early for security
    const requestMetadata = extractRequestMetadata(url, body, input.request.headers)
    validateRequest(requestMetadata)

    const timer = new RequestTimer({
      model: requestMetadata.model,
      is_stream: requestMetadata.isStream.toString(),
      session: requestMetadata.sessionId,
      request: requestMetadata.requestId,
      client: ocClient,
    })

    logger.info("Request started", {
      model: requestMetadata.model,
      session: requestMetadata.sessionId,
      request: requestMetadata.requestId,
      client: ocClient,
      is_stream: requestMetadata.isStream,
    })
    const zenData = ZenData.list()
    const modelInfo = validateModel(zenData, model)
    const dataDumper = createDataDumper(sessionId, requestId, projectId)
    const trialLimiter = createTrialLimiter(modelInfo.trial, ip, ocClient)
    const isTrial = await trialLimiter?.isTrial()
    const rateLimiter = createRateLimiter(modelInfo.rateLimit, ip, input.request.headers)
    await rateLimiter?.check()
    const stickyTracker = createStickyTracker(modelInfo.stickyProvider, sessionId)
    const stickyProvider = await stickyTracker?.get()
    const authInfo = await authenticate(modelInfo)
    const billingSource = validateBilling(authInfo, modelInfo)

    const retriableRequest = async (retry: RetryOptions = { excludeProviders: [], retryCount: 0 }) => {
      const providerInfo = selectProvider(
        model,
        zenData,
        authInfo,
        modelInfo,
        sessionId,
        isTrial ?? false,
        retry,
        stickyProvider,
      )
      validateModelSettings(authInfo)
      updateProviderKey(authInfo, providerInfo)
      logger.gauge("provider_requests", 1, { provider: providerInfo.id })

      const startTimestamp = Date.now()
      const reqUrl = providerInfo.modifyUrl(providerInfo.api, isStream)
      const reqBody = JSON.stringify(
        providerInfo.modifyBody({
          ...createBodyConverter(opts.format, providerInfo.format)(body),
          model: providerInfo.model,
        }),
      )
      // Log request details safely without NODE_ENV checks
      logger.debug("Provider request", {
        url: reqUrl,
        body_size: reqBody.length,
        provider: providerInfo.id,
      })
      const res = await fetch(reqUrl, {
        method: "POST",
        headers: (() => {
          const headers = new Headers(input.request.headers)
          providerInfo.modifyHeaders(headers, body, providerInfo.apiKey)
          Object.entries(providerInfo.headerMappings ?? {}).forEach(([k, v]) => {
            headers.set(k, headers.get(v)!)
          })
          headers.delete("host")
          headers.delete("content-length")
          headers.delete("x-neocode-request")
          headers.delete("x-neocode-session")
          headers.delete("x-neocode-project")
          headers.delete("x-neocode-client")
          return headers
        })(),
        body: reqBody,
      })

      // Try another provider => stop retrying if using fallback provider
      if (
        res.status !== 200 &&
        // ie. openai 404 error: Item with id 'msg_0ead8b004a3b165d0069436a6b6834819896da85b63b196a3f' not found.
        res.status !== 404 &&
        // ie. cannot change codex model providers mid-session
        modelInfo.stickyProvider !== "strict" &&
        modelInfo.fallbackProvider &&
        providerInfo.id !== modelInfo.fallbackProvider
      ) {
        return retriableRequest({
          excludeProviders: [...retry.excludeProviders, providerInfo.id],
          retryCount: retry.retryCount + 1,
        })
      }

      return { providerInfo, reqBody, res, startTimestamp }
    }

    const { providerInfo, reqBody, res, startTimestamp } = await retriableRequest()

    // Store model request
    dataDumper?.provideModel(providerInfo.storeModel)
    dataDumper?.provideRequest(reqBody)

    // Store sticky provider
    await stickyTracker?.set(providerInfo.id)

    // Temporarily change 404 to 400 status code b/c solid start automatically override 404 response
    const resStatus = res.status === 404 ? 400 : res.status

    // Scrub response headers
    const resHeaders = new Headers()
    const keepHeaders = ["content-type", "cache-control"]
    for (const [k, v] of res.headers.entries()) {
      if (keepHeaders.includes(k.toLowerCase())) {
        resHeaders.set(k, v)
      }
    }
    logger.debug("STATUS: " + res.status + " " + res.statusText)

    // Handle non-streaming response
    if (!isStream) {
      const responseConverter = createResponseConverter(providerInfo.format, opts.format)
      const json = await res.json()
      const body = JSON.stringify(responseConverter(json))
      logger.gauge("response_length", body.length)
      logger.debug("Provider response", {
        status: res.status,
        status_text: res.statusText,
        provider: providerInfo.id,
      })
      dataDumper?.provideResponse(body)
      dataDumper?.flush()
      const tokensInfo = providerInfo.normalizeUsage(json.usage)
      await trialLimiter?.track(tokensInfo)
      await rateLimiter?.track()
      const costInfo = await trackUsage(authInfo, modelInfo, providerInfo, billingSource, tokensInfo)
      await reload(authInfo, costInfo)

      // Record success metrics
      timer.record(true)
      logger.counter("requests_completed", 1, {
        provider: providerInfo.id,
        model: model,
        success: "true",
      })

      return new Response(body, {
        status: resStatus,
        statusText: res.statusText,
        headers: resHeaders,
      })
    }

    // Handle streaming response
    const streamConverter = createStreamPartConverter(providerInfo.format, opts.format)
    const usageParser = providerInfo.createUsageParser()
    const binaryDecoder = providerInfo.createBinaryStreamDecoder()

    // Create safe stream processor with memory limits
    const streamProcessor = createStreamProcessor(
      providerInfo.streamSeparator,
      (part) => {
        logger.debug("Stream part processed", {
          part_length: part.length,
          provider: providerInfo.id,
        })
        usageParser.parse(part)
      },
      (error) => {
        logger.error("Stream processing error", {
          error: error.message,
          provider: providerInfo.id,
        })
      },
    )

    const stream = new ReadableStream({
      start(c) {
        const reader = res.body?.getReader()
        const decoder = new TextDecoder()
        const encoder = new TextEncoder()

        let responseLength = 0

        function pump(): Promise<void> {
          return (
            reader?.read().then(async ({ done, value: rawValue }) => {
              if (done) {
                timer.record(true)
                logger.counter("requests_completed", 1, {
                  provider: providerInfo.id,
                  model: model,
                  success: "true",
                })
                logger.gauge("response_length", responseLength, {
                  "timestamp.last_byte": Date.now().toString(),
                })
                dataDumper?.flush()
                await rateLimiter?.track()

                // Finalize stream processor and get usage
                streamProcessor.finalize()
                const usage = usageParser.retrieve()
                if (usage) {
                  const tokensInfo = providerInfo.normalizeUsage(usage)
                  await trialLimiter?.track(tokensInfo)
                  const costInfo = await trackUsage(authInfo, modelInfo, providerInfo, billingSource, tokensInfo)
                  await reload(authInfo, costInfo)
                }
                c.close()
                return
              }

              if (responseLength === 0) {
                timer.recordTimeToFirstByte()
              }

              const value = binaryDecoder ? binaryDecoder(rawValue) : rawValue
              if (!value) return

              responseLength += value.length
              dataDumper?.provideStream(streamProcessor.getBufferSize().toString())

              // Process chunk safely with memory limits
              const processedParts = []
              const part = streamProcessor.processChunk(value)

              if (part && providerInfo.format !== opts.format) {
                const convertedPart = streamConverter(part)
                c.enqueue(encoder.encode(convertedPart + "\n\n"))
              } else if (part) {
                c.enqueue(value)
              }

              return pump()
            }) || Promise.resolve()
          )
        }

        return pump()
      },
    })

    return new Response(stream, {
      status: resStatus,
      statusText: res.statusText,
      headers: resHeaders,
    })
  } catch (error: any) {
    // Record failure metrics
    logger.counter("requests_failed", 1, {
      error_type: error.constructor.name,
      model: model,
    })

    logger.error("Request failed", {
      error_type: error.constructor.name,
      error_message: error.message,
      model: model,
      session: input.request.headers.get("x-neocode-session"),
    })

    // Note: both top level "type" and "error.type" fields are used by the @ai-sdk/anthropic client to render the error message.
    if (
      error instanceof AuthError ||
      error instanceof CreditsError ||
      error instanceof MonthlyLimitError ||
      error instanceof UserLimitError ||
      error instanceof ModelError
    )
      return new Response(
        JSON.stringify({
          type: "error",
          error: {
            type: error.constructor.name,
            message: error.message,
            action: error.action || "Check your API key and workspace settings in NeoCode Zen.",
          },
        }),
        { status: 401 },
      )

    if (error instanceof RateLimitError || error instanceof SubscriptionError) {
      const headers = new Headers()
      if (error instanceof SubscriptionError && error.retryAfter) {
        headers.set("retry-after", String(error.retryAfter))
      }
      return new Response(
        JSON.stringify({
          type: "error",
          error: {
            type: error.constructor.name,
            message: error.message,
            action: error.action || "Wait for the rate limit to reset or upgrade your plan.",
          },
        }),
        { status: 429, headers },
      )
    }

    // Generic error with proper type preservation
    return new Response(
      JSON.stringify({
        type: "error",
        error: {
          type: error.constructor.name || "InternalServerError",
          message: error.message || "An unexpected error occurred",
          action: "Try again or contact support if the problem persists.",
        },
      }),
      { status: 500 },
    )
  }

  function validateModel(zenData: ZenData, reqModel: string) {
    if (!(reqModel in zenData.models)) throw new ModelError(`Model ${reqModel} not supported`)

    const modelId = reqModel as keyof typeof zenData.models
    const modelData = Array.isArray(zenData.models[modelId])
      ? zenData.models[modelId].find((model) => opts.format === model.formatFilter)
      : zenData.models[modelId]

    if (!modelData) throw new ModelError(`Model ${reqModel} not supported for format ${opts.format}`)

    logger.gauge("model_requests", 1, { model: modelId })

    return { id: modelId, ...modelData }
  }

  function selectProvider(
    reqModel: string,
    zenData: ZenData,
    authInfo: AuthInfo,
    modelInfo: ModelInfo,
    sessionId: string,
    isTrial: boolean,
    retry: RetryOptions,
    stickyProvider: string | undefined,
  ) {
    // Validate selection context
    validateSelectionContext({
      model: reqModel,
      providers: modelInfo.providers,
      sessionId,
      isTrial,
      stickyProvider,
      byokProvider: modelInfo.byokProvider,
      trialProvider: modelInfo.trial?.provider,
      fallbackProvider: modelInfo.fallbackProvider,
      excludeProviders: retry.excludeProviders,
      retryCount: retry.retryCount,
      maxRetries: MAX_RETRIES,
    })

    // Use optimized provider selection
    const selectedProviderId = optimizedSelectProvider({
      model: reqModel,
      providers: modelInfo.providers,
      sessionId,
      isTrial,
      stickyProvider,
      byokProvider: modelInfo.byokProvider,
      trialProvider: modelInfo.trial?.provider,
      fallbackProvider: modelInfo.fallbackProvider,
      excludeProviders: retry.excludeProviders,
      retryCount: retry.retryCount,
      maxRetries: MAX_RETRIES,
    })

    if (!(selectedProviderId in zenData.providers)) {
      throw new ModelError(`Provider ${selectedProviderId} not supported`)
    }

    const modelProvider = modelInfo.providers.find((p) => p.id === selectedProviderId)
    if (!modelProvider) {
      throw new ModelError("Provider configuration not found")
    }

    return {
      ...modelProvider,
      ...zenData.providers[selectedProviderId],
      ...(() => {
        const format = zenData.providers[selectedProviderId].format
        const providerModel = modelProvider.model
        if (format === "anthropic") return anthropicHelper({ reqModel, providerModel })
        if (format === "google") return googleHelper({ reqModel, providerModel })
        if (format === "openai") return openaiHelper({ reqModel, providerModel })
        return oaCompatHelper({ reqModel, providerModel })
      })(),
    }
  }

  async function authenticate(modelInfo: ModelInfo) {
    const apiKey = opts.parseApiKey(input.request.headers)
    if (!apiKey || apiKey === "public") {
      if (modelInfo.allowAnonymous) return
      throw new AuthError("Missing API key.", "Add an API key in your NeoCode Zen settings.")
    }

    const data = await Database.use((tx) =>
      tx
        .select({
          apiKey: KeyTable.id,
          workspaceID: KeyTable.workspaceID,
          billing: {
            balance: BillingTable.balance,
            paymentMethodID: BillingTable.paymentMethodID,
            monthlyLimit: BillingTable.monthlyLimit,
            monthlyUsage: BillingTable.monthlyUsage,
            timeMonthlyUsageUpdated: BillingTable.timeMonthlyUsageUpdated,
            reloadTrigger: BillingTable.reloadTrigger,
            timeReloadLockedTill: BillingTable.timeReloadLockedTill,
            subscription: BillingTable.subscription,
          },
          user: {
            id: UserTable.id,
            monthlyLimit: UserTable.monthlyLimit,
            monthlyUsage: UserTable.monthlyUsage,
            timeMonthlyUsageUpdated: UserTable.timeMonthlyUsageUpdated,
          },
          subscription: {
            id: SubscriptionTable.id,
            rollingUsage: SubscriptionTable.rollingUsage,
            fixedUsage: SubscriptionTable.fixedUsage,
            timeRollingUpdated: SubscriptionTable.timeRollingUpdated,
            timeFixedUpdated: SubscriptionTable.timeFixedUpdated,
          },
          provider: {
            credentials: ProviderTable.credentials,
          },
          timeDisabled: ModelTable.timeCreated,
        })
        .from(KeyTable)
        .innerJoin(WorkspaceTable, eq(WorkspaceTable.id, KeyTable.workspaceID))
        .innerJoin(BillingTable, eq(BillingTable.workspaceID, KeyTable.workspaceID))
        .innerJoin(UserTable, and(eq(UserTable.workspaceID, KeyTable.workspaceID), eq(UserTable.id, KeyTable.userID)))
        .leftJoin(ModelTable, and(eq(ModelTable.workspaceID, KeyTable.workspaceID), eq(ModelTable.model, modelInfo.id)))
        .leftJoin(
          ProviderTable,
          modelInfo.byokProvider
            ? and(
                eq(ProviderTable.workspaceID, KeyTable.workspaceID),
                eq(ProviderTable.provider, modelInfo.byokProvider),
              )
            : sql`false`,
        )
        .leftJoin(
          SubscriptionTable,
          and(
            eq(SubscriptionTable.workspaceID, KeyTable.workspaceID),
            eq(SubscriptionTable.userID, KeyTable.userID),
            isNull(SubscriptionTable.timeDeleted),
          ),
        )
        .where(and(eq(KeyTable.key, apiKey), isNull(KeyTable.timeDeleted)))
        .then((rows) => rows[0]),
    )

    if (!data) throw new AuthError("Invalid API key.", "Check your API key in NeoCode Zen settings.")
    logger.gauge("api_key_requests", 1, {
      api_key: data.apiKey,
      workspace: data.workspaceID,
      isSubscription: data.subscription ? "true" : "false",
      subscription: data.billing.subscription?.plan ?? "",
    })

    return {
      apiKeyId: data.apiKey,
      workspaceID: data.workspaceID,
      billing: data.billing,
      user: data.user,
      subscription: data.subscription,
      provider: data.provider,
      isFree: FREE_WORKSPACES.includes(data.workspaceID),
      isDisabled: !!data.timeDisabled,
    }
  }

  function validateBilling(authInfo: AuthInfo, modelInfo: ModelInfo) {
    if (!authInfo) return "anonymous"
    if (authInfo.provider?.credentials) return "free"
    if (authInfo.isFree) return "free"
    if (modelInfo.allowAnonymous) return "free"

    // Validate subscription billing
    if (authInfo.billing.subscription && authInfo.subscription) {
      try {
        const sub = authInfo.subscription
        const plan = authInfo.billing.subscription.plan

        const formatRetryTime = (seconds: number) => {
          const days = Math.floor(seconds / 86400)
          if (days >= 1) return `${days} day${days > 1 ? "s" : ""}`
          const hours = Math.floor(seconds / 3600)
          const minutes = Math.ceil((seconds % 3600) / 60)
          if (hours >= 1) return `${hours}hr ${minutes}min`
          return `${minutes}min`
        }

        // Check weekly limit
        if (sub.fixedUsage && sub.timeFixedUpdated) {
          const result = Black.analyzeWeeklyUsage({
            plan,
            usage: sub.fixedUsage,
            timeUpdated: sub.timeFixedUpdated,
          })
          if (result.status === "rate-limited")
            throw new SubscriptionError(
              `Subscription quota exceeded. Retry in ${formatRetryTime(result.resetInSec)}.`,
              result.resetInSec,
            )
        }

        // Check rolling limit
        if (sub.rollingUsage && sub.timeRollingUpdated) {
          const result = Black.analyzeRollingUsage({
            plan,
            usage: sub.rollingUsage,
            timeUpdated: sub.timeRollingUpdated,
          })
          if (result.status === "rate-limited")
            throw new SubscriptionError(
              `Subscription quota exceeded. Retry in ${formatRetryTime(result.resetInSec)}.`,
              result.resetInSec,
            )
        }

        return "subscription"
      } catch (e) {
        if (!authInfo.billing.subscription.useBalance) throw e
      }
    }

    // Validate pay as you go billing
    const billing = authInfo.billing
    if (!billing.paymentMethodID)
      throw new CreditsError(
        `No payment method.`,
        "Add a payment method here: https://neo.khulnasoft.com/workspace/${authInfo.workspaceID}/billing",
      )
    if (billing.balance <= 0)
      throw new CreditsError(
        `Insufficient balance.`,
        "Add funds here: https://neo.khulnasoft.com/workspace/${authInfo.workspaceID}/billing",
      )

    const now = new Date()
    const currentYear = now.getUTCFullYear()
    const currentMonth = now.getUTCMonth()
    if (
      billing.monthlyLimit &&
      billing.monthlyUsage &&
      billing.timeMonthlyUsageUpdated &&
      billing.monthlyUsage >= centsToMicroCents(billing.monthlyLimit * 100) &&
      currentYear === billing.timeMonthlyUsageUpdated.getUTCFullYear() &&
      currentMonth === billing.timeMonthlyUsageUpdated.getUTCMonth()
    )
      throw new MonthlyLimitError(
        `Workspace monthly limit reached.`,
        "Manage limits here: https://neo.khulnasoft.com/workspace/${authInfo.workspaceID}/billing",
      )

    if (
      authInfo.user.monthlyLimit &&
      authInfo.user.monthlyUsage &&
      authInfo.user.timeMonthlyUsageUpdated &&
      authInfo.user.monthlyUsage >= centsToMicroCents(authInfo.user.monthlyLimit * 100) &&
      currentYear === authInfo.user.timeMonthlyUsageUpdated.getUTCFullYear() &&
      currentMonth === authInfo.user.timeMonthlyUsageUpdated.getUTCMonth()
    )
      throw new UserLimitError(
        `Personal monthly limit reached.`,
        "Manage limits here: https://neo.khulnasoft.com/workspace/${authInfo.workspaceID}/members",
      )

    return "balance"
  }

  function validateModelSettings(authInfo: AuthInfo) {
    if (!authInfo) return
    if (authInfo.isDisabled) throw new ModelError("Model is disabled")
  }

  function updateProviderKey(authInfo: AuthInfo, providerInfo: ProviderInfo) {
    if (!authInfo?.provider?.credentials) return
    providerInfo.apiKey = authInfo.provider.credentials
  }

  async function trackUsage(
    authInfo: AuthInfo,
    modelInfo: ModelInfo,
    providerInfo: ProviderInfo,
    billingSource: ReturnType<typeof validateBilling>,
    usageInfo: UsageInfo,
  ) {
    const { inputTokens, outputTokens, reasoningTokens, cacheReadTokens, cacheWrite5mTokens, cacheWrite1hTokens } =
      usageInfo

    const modelCost =
      modelInfo.cost200K &&
      inputTokens + (cacheReadTokens ?? 0) + (cacheWrite5mTokens ?? 0) + (cacheWrite1hTokens ?? 0) > 200_000
        ? modelInfo.cost200K
        : modelInfo.cost

    const inputCost = modelCost.input * inputTokens * 100
    const outputCost = modelCost.output * outputTokens * 100
    const reasoningCost = (() => {
      if (!reasoningTokens) return undefined
      return modelCost.output * reasoningTokens * 100
    })()
    const cacheReadCost = (() => {
      if (!cacheReadTokens) return undefined
      if (!modelCost.cacheRead) return undefined
      return modelCost.cacheRead * cacheReadTokens * 100
    })()
    const cacheWrite5mCost = (() => {
      if (!cacheWrite5mTokens) return undefined
      if (!modelCost.cacheWrite5m) return undefined
      return modelCost.cacheWrite5m * cacheWrite5mTokens * 100
    })()
    const cacheWrite1hCost = (() => {
      if (!cacheWrite1hTokens) return undefined
      if (!modelCost.cacheWrite1h) return undefined
      return modelCost.cacheWrite1h * cacheWrite1hTokens * 100
    })()
    const totalCostInCent =
      inputCost +
      outputCost +
      (reasoningCost ?? 0) +
      (cacheReadCost ?? 0) +
      (cacheWrite5mCost ?? 0) +
      (cacheWrite1hCost ?? 0)

    logger.histogram("tokens_used", inputTokens, { token_type: "input" })
    logger.histogram("tokens_used", outputTokens, { token_type: "output" })
    if (reasoningTokens) logger.histogram("tokens_used", reasoningTokens, { token_type: "reasoning" })
    if (cacheReadTokens) logger.histogram("tokens_used", cacheReadTokens, { token_type: "cache_read" })
    if (cacheWrite5mTokens) logger.histogram("tokens_used", cacheWrite5mTokens, { token_type: "cache_write_5m" })
    if (cacheWrite1hTokens) logger.histogram("tokens_used", cacheWrite1hTokens, { token_type: "cache_write_1h" })

    logger.histogram("cost_input", Math.round(inputCost))
    logger.histogram("cost_output", Math.round(outputCost))
    if (reasoningCost) logger.histogram("cost_reasoning", Math.round(reasoningCost))
    if (cacheReadCost) logger.histogram("cost_cache_read", Math.round(cacheReadCost))
    if (cacheWrite5mCost) logger.histogram("cost_cache_write_5m", Math.round(cacheWrite5mCost))
    if (cacheWrite1hCost) logger.histogram("cost_cache_write_1h", Math.round(cacheWrite1hCost))
    logger.histogram("cost_total", Math.round(totalCostInCent))

    if (billingSource === "anonymous") return
    authInfo = authInfo!

    const cost = authInfo.provider?.credentials ? 0 : centsToMicroCents(totalCostInCent)
    await Database.use((db) =>
      Promise.all([
        db.insert(UsageTable).values({
          workspaceID: authInfo.workspaceID,
          id: Identifier.create("usage"),
          model: modelInfo.id,
          provider: providerInfo.id,
          inputTokens,
          outputTokens,
          reasoningTokens,
          cacheReadTokens,
          cacheWrite5mTokens,
          cacheWrite1hTokens,
          cost,
          keyID: authInfo.apiKeyId,
          enrichment: billingSource === "subscription" ? { plan: "sub" } : undefined,
        }),
        db
          .update(KeyTable)
          .set({ timeUsed: sql`now()` })
          .where(and(eq(KeyTable.workspaceID, authInfo.workspaceID), eq(KeyTable.id, authInfo.apiKeyId))),
        ...(billingSource === "subscription"
          ? (() => {
              const plan = authInfo.billing.subscription!.plan
              const black = BlackData.getLimits({ plan })
              const week = getWeekBounds(new Date())
              const rollingWindowSeconds = black.rollingWindow * 3600
              return [
                db
                  .update(SubscriptionTable)
                  .set({
                    fixedUsage: sql`
              CASE
                WHEN ${SubscriptionTable.timeFixedUpdated} >= ${week.start} THEN ${SubscriptionTable.fixedUsage} + ${cost}
                ELSE ${cost}
              END
            `,
                    timeFixedUpdated: sql`now()`,
                    rollingUsage: sql`
              CASE
                WHEN UNIX_TIMESTAMP(${SubscriptionTable.timeRollingUpdated}) >= UNIX_TIMESTAMP(now()) - ${rollingWindowSeconds} THEN ${SubscriptionTable.rollingUsage} + ${cost}
                ELSE ${cost}
              END
            `,
                    timeRollingUpdated: sql`
              CASE
                WHEN UNIX_TIMESTAMP(${SubscriptionTable.timeRollingUpdated}) >= UNIX_TIMESTAMP(now()) - ${rollingWindowSeconds} THEN ${SubscriptionTable.timeRollingUpdated}
                ELSE now()
              END
            `,
                  })
                  .where(
                    and(
                      eq(SubscriptionTable.workspaceID, authInfo.workspaceID),
                      eq(SubscriptionTable.userID, authInfo.user.id),
                    ),
                  ),
              ]
            })()
          : [
              db
                .update(BillingTable)
                .set({
                  balance: authInfo.isFree
                    ? sql`${BillingTable.balance} - ${0}`
                    : sql`${BillingTable.balance} - ${cost}`,
                  monthlyUsage: sql`
              CASE
                WHEN MONTH(${BillingTable.timeMonthlyUsageUpdated}) = MONTH(now()) AND YEAR(${BillingTable.timeMonthlyUsageUpdated}) = YEAR(now()) THEN ${BillingTable.monthlyUsage} + ${cost}
                ELSE ${cost}
              END
            `,
                  timeMonthlyUsageUpdated: sql`now()`,
                })
                .where(eq(BillingTable.workspaceID, authInfo.workspaceID)),
              db
                .update(UserTable)
                .set({
                  monthlyUsage: sql`
              CASE
                WHEN MONTH(${UserTable.timeMonthlyUsageUpdated}) = MONTH(now()) AND YEAR(${UserTable.timeMonthlyUsageUpdated}) = YEAR(now()) THEN ${UserTable.monthlyUsage} + ${cost}
                ELSE ${cost}
              END
            `,
                  timeMonthlyUsageUpdated: sql`now()`,
                })
                .where(and(eq(UserTable.workspaceID, authInfo.workspaceID), eq(UserTable.id, authInfo.user.id))),
            ]),
      ]),
    )

    return { costInMicroCents: cost }
  }

  async function reload(authInfo: AuthInfo, costInfo: Awaited<ReturnType<typeof trackUsage>>) {
    if (!authInfo) return
    if (authInfo.isFree) return
    if (authInfo.provider?.credentials) return
    if (authInfo.subscription) return

    if (!costInfo) return

    const reloadTrigger = centsToMicroCents((authInfo.billing.reloadTrigger ?? Billing.RELOAD_TRIGGER) * 100)
    if (authInfo.billing.balance - costInfo.costInMicroCents >= reloadTrigger) return
    if (authInfo.billing.timeReloadLockedTill && authInfo.billing.timeReloadLockedTill > new Date()) return

    const lock = await Database.use((tx) =>
      tx
        .update(BillingTable)
        .set({
          timeReloadLockedTill: sql`now() + interval 1 minute`,
        })
        .where(
          and(
            eq(BillingTable.workspaceID, authInfo.workspaceID),
            eq(BillingTable.reload, true),
            lt(BillingTable.balance, reloadTrigger),
            or(isNull(BillingTable.timeReloadLockedTill), lt(BillingTable.timeReloadLockedTill, sql`now()`)),
          ),
        ),
    )
    if (lock.rowsAffected === 0) return

    await Actor.provide("system", { workspaceID: authInfo.workspaceID }, async () => {
      await Billing.reload()
    })
  }
}
