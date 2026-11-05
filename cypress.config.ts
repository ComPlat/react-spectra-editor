import { defineConfig } from "cypress";

export default defineConfig({
  pageLoadTimeout: 100000,
  requestTimeout: 100000,
  responseTimeout: 100000,
  e2e: {
    // The editor dev page (`yarn start:dev`). Override with CYPRESS_BASE_URL to run against
    // another port.
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
    pageLoadTimeout: 100000,
    requestTimeout: 100000,
    responseTimeout: 100000,
  },
});
