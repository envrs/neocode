const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production"
    ? "https://neocode.ai"
    : `https://${stage}.neocode.ai`,
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/neopilot-ai/neocode",
  discord: "https://neocode.ai/discord",
  headerLinks: [
    { name: "Home", url: "/" },
    { name: "Docs", url: "/docs/" },
  ],
}
