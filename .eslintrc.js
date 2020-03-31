module.exports = {
  "extends": "airbnb",
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },
  "rules": {
    "react/no-array-index-key": "off",
    "react/forbid-prop-types": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "class-methods-use-this": 0,
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
  }
};
