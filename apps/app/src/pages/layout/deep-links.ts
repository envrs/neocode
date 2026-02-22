export const deepLinkEvent = "neocode:deep-link"

export const parseDeepLink = (input: string) => {
  if (!input.startsWith("neocode://")) return
  if (typeof URL.canParse === "function" && !URL.canParse(input)) return
  const url = (() => {
    try {
      return new URL(input)
    } catch {
      return undefined
    }
  })()
  if (!url) return
  if (url.hostname !== "open-project") return
  const directory = url.searchParams.get("directory")
  if (!directory) return
  return directory
}

export const collectOpenProjectDeepLinks = (urls: string[]) =>
  urls.map(parseDeepLink).filter((directory): directory is string => !!directory)

type NeoCodeWindow = Window & {
  __NEOCODE__?: {
    deepLinks?: string[]
  }
}

export const drainPendingDeepLinks = (target: NeoCodeWindow) => {
  const pending = target.__NEOCODE__?.deepLinks ?? []
  if (pending.length === 0) return []
  if (target.__NEOCODE__) target.__NEOCODE__.deepLinks = []
  return pending
}
