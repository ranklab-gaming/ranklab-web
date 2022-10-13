import { defineConfig } from "cypress"
const { loadEnvConfig } = require("@next/env")

export default defineConfig({
  defaultCommandTimeout: 8000,
  e2e: {
    async setupNodeEvents(on, config) {
      loadEnvConfig(__dirname)

      config.env.stripeAccountId = process.env.TEST_STRIPE_ACCOUNT_ID
      config.env.stripeCustomerId = process.env.TEST_STRIPE_CUSTOMER_ID

      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://ranklab-test:3000",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
})
