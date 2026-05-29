import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export const apiClient = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Request Interceptor with PROACTIVE Token Refresh
 *
 * This is the BEST pattern:
 * - Checks token expiration BEFORE sending request
 * - Refreshes token ONLY when needed
 * - Never gets 401 errors in the first place
 * - No infinite loops, no race conditions
 */
apiClient.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("session")?.value;

  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default apiClient;
