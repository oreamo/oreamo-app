const RESTRICTED_IMPORTS = [
  {
    name: "react-router",
    importNames: ["useNavigate"],
    replacements: ["useNavigator"],
    message: "from `@/hooks/useNavigator`",
    allowedIn: "src/hooks/useNavigator.ts",
  },
];

const REACT_ROUTER_ALLOWED_FILES = [
  ...new Set(RESTRICTED_IMPORTS.map(({ allowedIn }) => allowedIn)),
];

function toRestrictedImportPath({ name, importNames, replacements, message }) {
  const replacementList = replacements.map((name) => `\`${name}\``).join(", ");

  return {
    name,
    importNames,
    message: `${importNames.join("/")} may not be used directly. Use ${replacementList} ${message} instead.`,
  };
}

function createReactRouterRestrictedImportPaths(allowedFile) {
  return RESTRICTED_IMPORTS.filter(
    ({ allowedIn }) => allowedIn !== allowedFile,
  ).map(toRestrictedImportPath);
}

export const reactRouterRestrictedImportPaths =
  createReactRouterRestrictedImportPaths();

export function createReactRouterConstraintOverrides({
  paths = [],
  patterns = [],
}) {
  return REACT_ROUTER_ALLOWED_FILES.map((allowedFile) => {
    const reactRouterImportPaths =
      createReactRouterRestrictedImportPaths(allowedFile);

    return {
      files: [allowedFile],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            paths: [...reactRouterImportPaths, ...paths],
            patterns,
          },
        ],
      },
    };
  });
}
