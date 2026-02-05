import { config } from "@uwdsc/eslint-config/base";

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
