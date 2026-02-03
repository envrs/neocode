interface ImportMetaEnv {
  readonly VITE_NEOCODE_SERVER_HOST: string
  readonly VITE_NEOCODE_SERVER_PORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
