const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production"
    ? "https://neo.khulnasoft.com"
    : `https://${stage}.neo.khulnasoft.com`,
  socialCard: "https://social-cards.sst.dev",
  github: "https://github.com/neopilot-ai/neocode",
  discord: "https://neo.khulnasoft.com/discord",
  headerLinks: [
    { name: "Home", url: "/" },
    { name: "Docs", url: "/docs/" },
  ],
}
