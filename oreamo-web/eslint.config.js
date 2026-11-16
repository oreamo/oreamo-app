import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

import encapsulationConstraint from "./lints/encapsulation-constraint.js";
import { createMuiConstraintOverrides } from "./lints/mui-constraint.js";
import reactConstraint from "./lints/react-constraint.js";
import {
  createReactRouterConstraintOverrides,
  reactRouterRestrictedImportPaths,
} from "./lints/react-router-constraint.js";
import {
  createRhfConstraintOverrides,
  rhfRestrictedImportPaths,
} from "./lints/rhf-constraint.js";

export default defineConfig(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "19",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactRefresh.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-restricted-imports": [
        "error",
        {
          paths: [
            ...reactRouterRestrictedImportPaths,
            ...rhfRestrictedImportPaths,
          ],
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            ["internal", "parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "react{,/**}",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@{,/**}",
              group: "internal",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
    },
  },
  ...createMuiConstraintOverrides({
    paths: [...reactRouterRestrictedImportPaths, ...rhfRestrictedImportPaths],
  }),
  ...createRhfConstraintOverrides({
    paths: reactRouterRestrictedImportPaths,
  }),
  ...createReactRouterConstraintOverrides({
    paths: rhfRestrictedImportPaths,
  }),
  ...encapsulationConstraint,
  ...reactConstraint,
);
