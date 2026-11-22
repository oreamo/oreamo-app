import path from "node:path";

const noUnderscoreFolderEscape = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow importing from an `_`-prefixed folder outside of that folder's parent directory.",
    },
    schema: [],
    messages: {
      restricted:
        "'{{importPath}}' is inside a private `_`-folder ('{{privateSegment}}'). It may only be imported from within '{{ownerDir}}'.",
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;
        if (!importSource.startsWith("@/")) {
          return;
        }

        const segments = importSource.slice(2).split("/");
        const privateIndex = segments.findIndex((segment) =>
          segment.startsWith("_"),
        );
        if (privateIndex === -1) {
          return;
        }

        const ownerDir = path.join("src", ...segments.slice(0, privateIndex));
        const currentDir = path.dirname(context.filename);
        const absoluteOwnerDir = path.resolve(context.cwd, ownerDir);

        const isInsideOwner =
          currentDir === absoluteOwnerDir ||
          currentDir.startsWith(absoluteOwnerDir + path.sep);

        if (!isInsideOwner) {
          context.report({
            node,
            messageId: "restricted",
            data: {
              importPath: importSource,
              privateSegment: segments[privateIndex],
              ownerDir,
            },
          });
        }
      },
    };
  },
};

export default [
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      encapsulation: {
        rules: {
          "no-underscore-folder-escape": noUnderscoreFolderEscape,
        },
      },
    },
    rules: {
      "encapsulation/no-underscore-folder-escape": "error",
    },
  },
];
