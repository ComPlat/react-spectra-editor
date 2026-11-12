module.exports = {
  "extends": "airbnb",
  "parserOptions": {
    "ecmaVersion": 2022,
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },
  "settings": {
    "import/resolver": {
      "node": { "extensions": [".js", ".jsx", ".ts", ".tsx"] }
    }
  },
  "rules": {
    "react/no-array-index-key": "off",
    "react/forbid-prop-types": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".tsx"] }],
    "class-methods-use-this": 0,
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "import/extensions": ["error", "ignorePackages", {
      "js": "never", "jsx": "never", "ts": "never", "tsx": "never"
    }],
    // JSX compiles with babel's automatic runtime (package.json "babel"), so React need
    // not be in scope. jsx-uses-react stays on so an existing `import React` still counts.
    "react/react-in-jsx-scope": "off",
  },
  "overrides": [
    {
      // Tests define small throwaway components and spread props into mocks.
      "files": ["src/__tests__/**"],
      "rules": {
        "react/prop-types": "off",
        "react/jsx-props-no-spreading": "off",
      }
    },
    {
      // Only the tests use TypeScript, and nothing type-checks them yet, so this parses
      // TS syntax and swaps in the TS-aware versions of rules that misfire on types.
      "files": ["*.ts", "*.tsx"],
      "parser": "@typescript-eslint/parser",
      "plugins": ["@typescript-eslint"],
      "rules": {
        "no-undef": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": "error",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": "error",
      }
    }
  ]
};
