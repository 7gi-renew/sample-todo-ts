module.exports = {
  env: {
    browser: true, // ブラウザ対応
    es2021: true, // ES2021に対応
    node: true, // Node.js対応
  },
  extends: [
    // ESLintの推奨設定を使う
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    'prettier',
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
  },
};
