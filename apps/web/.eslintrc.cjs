module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@next/next/recommended",
  ],
  parser: "@typescript-eslint/parser",
  root: true,
  ignorePatterns: ["**/*.js"],
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["src/pages/**/*.tsx", "src/pages/**/*.ts"],
      rules: {
        "react/function-component-definition": 0,
        "react/display-name": 0,
      },
    },
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-types": 0,
    "react/function-component-definition": [
      2,
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/hook-use-state": 2,
    "react/jsx-boolean-value": 2,
    "react/jsx-child-element-spacing": 2,
    "react/jsx-closing-bracket-location": 2,
    "react/jsx-closing-tag-location": 2,
    "react/jsx-curly-brace-presence": 2,
    "react/jsx-curly-spacing": 2,
    "react/jsx-equals-spacing": 2,
    "react/jsx-first-prop-new-line": 2,
    "react/jsx-fragments": 2,
    "react/jsx-handler-names": 0,
    "react/jsx-indent": [
      2,
      2,
      { checkAttributes: true, indentLogicalExpressions: true },
    ],
    "react/jsx-indent-props": [2, 2],
    "react/jsx-no-leaked-render": 2,
    "react/jsx-no-useless-fragment": 2,
    "react/jsx-pascal-case": 2,
    "react/jsx-props-no-multi-spaces": 2,
    "react/jsx-tag-spacing": 2,
    "react/no-namespace": 2,
    "react/no-object-type-as-default-prop": 2,
    "react/self-closing-comp": 2,
    "react/no-unused-prop-types": 2,
    "react/react-in-jsx-scope": 0,
  },
}
