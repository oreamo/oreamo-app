const RESTRICTED_RHF_APIS = [
  {
    source: "react-hook-form",
    importNames: ["useForm"],
    replacements: ["useDataForm"],
    allowedIn: "src/components/data-form",
  },
  {
    source: "react-hook-form",
    importNames: ["FormProvider", "useFormContext"],
    replacements: ["DataForm", "SearchForm", "DetailForm"],
    allowedIn: "src/components/data-form",
  },
  {
    source: "react-hook-form",
    importNames: ["Controller", "useController"],
    replacements: ["TextInputField", "SelectInputField"],
    allowedIn: "src/components/data-form",
  },
];

const RHF_ALLOWED_DIRS = [
  ...new Set(RESTRICTED_RHF_APIS.map(({ allowedIn }) => allowedIn)),
];

function toRestrictedImportPath({
  source,
  importNames,
  replacements,
  allowedIn,
}) {
  const replacementList = replacements.map((name) => `\`${name}\``).join(", ");
  const message = `react-hook-form's ${importNames.join("/")} may only be used within \`${allowedIn}\`. Use ${replacementList}, etc. from \`@/components/data-form\` instead.`;

  return { name: source, importNames, message };
}

function createRhfRestrictedImportPaths(allowedDir) {
  return RESTRICTED_RHF_APIS.filter(
    ({ allowedIn }) => allowedIn !== allowedDir,
  ).map(toRestrictedImportPath);
}

export const rhfRestrictedImportPaths = createRhfRestrictedImportPaths();

export function createRhfConstraintOverrides({ paths = [], patterns = [] }) {
  return RHF_ALLOWED_DIRS.map((allowedDir) => {
    const rhfImportPaths = createRhfRestrictedImportPaths(allowedDir);

    return {
      files: [`${allowedDir}/**/*.{ts,tsx}`],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [...rhfImportPaths, ...paths],
            patterns,
          },
        ],
      },
    };
  });
}
