import { defineConfig } from "cypress";

export default defineConfig({
  pageLoadTimeout: 100000,
  requestTimeout: 100000,
  responseTimeout: 100000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalStudio: true,
    pageLoadTimeout: 100000,
    requestTimeout: 100000,
    responseTimeout: 100000,
  },
});
