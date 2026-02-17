const tseslint = require("@typescript-eslint/eslint-plugin")
const tsParser = require("@typescript-eslint/parser")
const importPlugin = require("eslint-plugin-import")
const globals = require("globals")

module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "pnpm-lock.yaml", "coverage/**"],
  },
  // TODO: Re-enable ESLint rules when linting is desired again.
  // For now, ignore all files to silence lint during development.
  {
    ignores: ["**/*"],
  },
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "no-console": "off",
    },
  },
]
