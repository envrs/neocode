export interface ExtensionManifest {
  id: string
  name: string
  version: string
  permissions: Permission[]
}

export type Permission = "fs.read" | "fs.write" | "network" | "shell"

export interface SandboxContext {
  cwd: string
  invoke: (command: string, args: Record<string, unknown>) => Promise<any>
}

export interface ExtensionLifecycleHooks {
  onInstall?: (context: SandboxContext) => Promise<void>
  onActivate: (context: SandboxContext) => Promise<void>
  onDeactivate?: (context: SandboxContext) => Promise<void>
}

/**
 * Initializes and registers an extension within the secure sandboxed runtime.
 */
export function defineExtension(manifest: ExtensionManifest, hooks: ExtensionLifecycleHooks) {
  // In a real implementation this would register with the host process
  return { manifest, hooks }
}
