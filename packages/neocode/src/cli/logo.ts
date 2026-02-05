export const logo = {
  left: ["                   ", "     █▀▀▄ █▀▀█ █▀▀█", "     █__█ █^^^ █__█", "     ▀~~▀ ▀▀▀▀ ▀▀▀▀"],
  right: ["             ▄     ", "█▀▀▀ █▀▀█ █▀▀█ █▀▀█", "█___ █__█ █__█ █^^^", "▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀"],
}

export const marks = "_^~"

export function draw(line: string, fg: string, shadow: string, bg: string, reset: string = "\x1b[0m") {
  const parts: string[] = []
  for (const char of line) {
    if (char === "_") {
      parts.push(bg, " ", reset)
      continue
    }
    if (char === "^") {
      parts.push(fg, bg, "▀", reset)
      continue
    }
    if (char === "~") {
      parts.push(shadow, "▀", reset)
      continue
    }
    if (char === " ") {
      parts.push(" ")
      continue
    }
    parts.push(fg, char, reset)
  }
  return parts.join("")
}
