const muiRestrictedImports = {
  paths: [
    {
      name: "@mui/material",
      allowImportNames: ["styled"],
      message:
        "MUI may not be used within `src/pages` except `styled`. Use components from `@/components` instead.",
    },
  ],
  patterns: [
    {
      group: ["@mui/**", "!@mui/material"],
      message:
        "MUI may not be used within `src/pages` except `styled`. Use components from `@/components` instead.",
    },
  ],
};

export function createMuiConstraintOverrides({ paths = [], patterns = [] }) {
  return [
    {
      files: ["src/pages/**/*.{ts,tsx}"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [...muiRestrictedImports.paths, ...paths],
            patterns: [...muiRestrictedImports.patterns, ...patterns],
          },
        ],
      },
    },
  ];
}
