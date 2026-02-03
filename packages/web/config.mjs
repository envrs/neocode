const stage = process.env.SST_STAGE || "dev"

export default {
  url: stage === "production" ? "https://neo.khulnasoft.com" : `https://${stage}.neo.khulnasoft.com`,
  console: stage === "production" ? "https://neo.khulnasoft.com/auth" : `https://${stage}.neo.khulnasoft.com/auth`,
  email: "contact@anoma.ly",
  socialCard: "https://social-cards.khulnasoft.com",
  github: "https://github.com/neopilot-ai/neocode",
  discord: "https://neo.khulnasoft.com/discord",
  headerLinks: [
    { name: "Home", url: "/" },
    { name: "Docs", url: "/docs/" },
  ],
}
