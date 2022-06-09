import { defineConfig } from "cypress"

export default defineConfig({
  projectId: "mw3765",
  defaultCommandTimeout: 8000,
  env: {
    auth0Password: "password123*",
  },
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://ranklab-test:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
})
