import { decodeJWT } from "./jwt.js";
import { clearOfficeRoutes } from "./route.js";

export function getAuth() {
  const token = document.cookie
    .split("; ")
    .find((c) => c.startsWith("accessToken="))
    ?.split("=")[1];

  if (!token) return null;

  const payload = decodeJWT(token);

  return payload;
}
export function forceLogout() {
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  clearOfficeRoutes()
}
