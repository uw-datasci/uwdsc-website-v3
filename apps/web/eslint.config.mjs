import { nextJsConfig } from "@uwdsc/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default [
  ...nextJsConfig,
  {
    ignores: [
      ".next/**",
      ".turbo/**",
      ".vercel/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
];
