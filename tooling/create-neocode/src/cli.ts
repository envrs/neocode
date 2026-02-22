#!/usr/bin/env bun
import { parseArgs } from "util"

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    template: {
      type: "string",
      short: "t",
      default: "app", // 'app', 'service', 'extension'
    },
    help: {
      type: "boolean",
      short: "h",
    },
  },
  strict: true,
  allowPositionals: true,
})

if (values.help) {
  console.log(`
Usage: create-neocode <project-name> [options]

Options:
  -t, --template <app|service|extension>  The template to use (default: app)
  -h, --help                              Show this help message
`)
  process.exit(0)
}

const projectName = positionals[2]
if (!projectName) {
  console.error("Please specify the project directory:")
  console.error("  create-neocode <project-name>")
  process.exit(1)
}

console.log(`Scaffolding neocode ${values.template} in ${projectName}...`)
// Actual scaffolding logic would clone templates and run workspace bindings here
console.log(`\nSuccessfully created ${projectName}.`)
