import { getServerAuthToken } from "../serverCookieHandelr";
import { verifyAccessToken } from "./jwt";

export async function getServerRole() {
  const token = await getServerAuthToken()
  try {
    const payload = await verifyAccessToken(token);
    return payload?.permissions?.roles || "guest";
  } catch {
    return "guest";
  }
}

export async function getUserPermissions() {
  const token = await getServerAuthToken()
  try {
    const payload = await verifyAccessToken(token);
    return payload?.permissions?.user_permissions || []
  } catch {
    return []
  }
}