export namespace Flag {
  export const NEOCODE_AUTO_SHARE = truthy("NEOCODE_AUTO_SHARE")
  export const NEOCODE_DISABLE_WATCHER = truthy("NEOCODE_DISABLE_WATCHER")
  export const NEOCODE_CONFIG = process.env["NEOCODE_CONFIG"]

  function truthy(key: string) {
    const value = process.env[key]?.toLowerCase()
    return value === "true" || value === "1"
  }
}
