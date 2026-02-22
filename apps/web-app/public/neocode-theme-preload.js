;(function () {
  var themeId = localStorage.getItem("neocode-theme-id")
  if (!themeId) return

  var scheme = localStorage.getItem("neocode-color-scheme") || "system"
  var isDark = scheme === "dark" || (scheme === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
  var mode = isDark ? "dark" : "light"

  document.documentElement.dataset.theme = themeId
  document.documentElement.dataset.colorScheme = mode

  if (themeId === "neocode-1") return

  var css = localStorage.getItem("neocode-theme-css-" + themeId + "-" + mode)
  if (css) {
    var style = document.createElement("style")
    style.id = "neocode-theme-preload"
    style.textContent =
      ":root{color-scheme:" +
      mode +
      ";--text-mix-blend-mode:" +
      (isDark ? "plus-lighter" : "multiply") +
      ";" +
      css +
      "}"
    document.head.appendChild(style)
  }
})()
