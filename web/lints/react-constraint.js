export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "function-declaration",
          unnamedComponents: "arrow-function",
        },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "VariableDeclarator[id.name=/^use[A-Z]/] > :matches(ArrowFunctionExpression, FunctionExpression)",
          message: "Hooks must be declared with the `function` keyword.",
        },
        {
          selector:
            ":matches(CallExpression[callee.name='memo'], CallExpression[callee.property.name='memo']) > :matches(ArrowFunctionExpression, FunctionExpression)",
          message:
            "Components must be declared with the `function` keyword. Declare the component first and pass it to `memo`.",
        },
      ],
      "import/no-default-export": "error",
    },
  },
  {
    files: ["src/types/**/*.d.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
];
