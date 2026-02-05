import { config } from "@uwdsc/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      // Disable all warnings - only show errors
      "@typescript-eslint/no-unused-vars": "off",
      "import/no-default-export": "off",
      // Turn off the specific warning about export default
      "import/no-named-default": "off",
    },
  },
];
