import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  // Ignore generated/build output and Docusaurus internals
  globalIgnores([
    "dist/**",
    "build/**",
    "node_modules/**",
    ".docusaurus/**",
    "**/.docusaurus/**",
  ]),

  // Base JS rules for all JS/TS files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React rules — scoped to JSX/TSX files only
  {
    files: ["**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        // Automatically detect the React version from package.json
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      // React 17+ JSX transform — no need to import React in scope
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      // TypeScript handles prop types
      "react/prop-types": "off",
    },
  },

  // Config files (docusaurus.config.ts, sidebars.ts, eslint.config.mts)
  // are Node.js scripts — relax some TS rules that fire on config patterns
  {
    files: ["*.config.{ts,mts,cts,js,mjs}", "sidebars.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]);
