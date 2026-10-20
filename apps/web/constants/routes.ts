import { WEB_COMPLETE_PROFILE_PATH } from "@uwdsc/common/constants";

/** Pages under app/(auth) render full-screen, without the navbar or footer. */
export const AUTH_PAGE_PATHS = new Set([
  "/login",
  "/register",
  WEB_COMPLETE_PROFILE_PATH,
  "/forgot-password",
  "/reset-password",
  "/reset-password-confirm",
  "/confirm-email",
  "/auth-code-error",
]);
