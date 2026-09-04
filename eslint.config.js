import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  { ignores: ["dist", "node_modules", "coverage"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        HTMLCanvasElement: "readonly",
        URL: "readonly",
        Blob: "readonly",
        Intl: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        cy: "readonly",
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
    settings: { react: { version: "detect" } },
  },
];
