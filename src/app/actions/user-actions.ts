"use server";

import { cookies } from "next/headers";
import axios from "axios";
// import {
//    clearAccessToken,
//    setAccessToken,
// } from "./lib/api-client";
const jwt = require("jsonwebtoken");

// Server-side error logging utility
function logServerError(error: any, context: string, data?: any) {
  // Log to server console (visible in terminal/Next.js dev output)
  console.error(`[Server Error] ${context}:`, {
    message: error?.message || "Unknown error",
    status: error?.response?.status || error?.status,
    data: error?.response?.data,
    config: error?.config,
    timestamp: new Date().toISOString(),
    requestData: data,
  });

  // Return error info to be logged on client
  return {
    serverMessage: error?.response?.data?.message || error?.message,
    serverStatus: error?.response?.status,
    serverData: error?.response?.data,
  };
}

export async function decrypt(token: string): Promise<any> {
  const payload = jwt.decode(token, process.env.SECRET_KEY);
  return payload;
}

export async function register(data: {
  username: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const res = await axios.post(`${process.env.API_URL}/User/register`, {
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    return {
      success: true,
      status: "200",
      message: "Register successful",
      data: res.data,
    };
  } catch (error: any) {
    // Return error object instead of throwing for consistent handling
    const status = error?.response?.status;
    let message = "Registration failed. Please try again.";

    // Provide more specific error messages
    if (status === 400) {
      message =
        error?.response?.data?.message ||
        "Invalid registration data. Please check your input.";
    } else if (status === 409) {
      message = "Username already exists. Please choose a different username.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    return {
      success: false,
      status: status?.toString() || "500",
      message: message,
    };
  }
}

export async function login(data: { username: string; password: string }) {
  try {
    const res = await axios.post(`${process.env.API_URL}/User/login`, {
      username: data.username,
      password: data.password,
    });
    const cookie = await cookies();
    if (process.env.NODE_ENV === "development") {
      // Disable Secure flag and extend lifetime in dev mode
      // Nhớ xóa cái này
      cookie.set("session", res.data.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      // setAccessToken(res.data.accessToken); // Set in-memory token for API client
      cookie.set("refreshToken", res.data.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
    } else {
      cookie.set("session", res.data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
      // setAccessToken(res.data.accessToken); // Set in-memory token for API client
      cookie.set("refreshToken", res.data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
    }

    return {
      success: true,
      status: "200",
      message: "Login successful",
    };
  } catch (error: any) {
    // Log error to server console for debugging
    const errorDetails = logServerError(error, "Login", {
      username: data.username,
    });

    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Login failed. Please try again.";

    // Provide more specific error messages based on status code
    if (status === 401 || status === 400) {
      message = "The username or password was incorrect.";
    } else if (status === 404) {
      message = "User not found. Please check your username.";
    } else if (status === 429) {
      message = "Too many login attempts. Please try again later.";
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    // Return detailed error info for client-side logging
    return {
      success: false,
      status: status?.toString() || "500",
      message: message,
      debugInfo: errorDetails, // Include debug info for client logging
    };
  }
}

export async function logout() {
  const cookie = await cookies();
  cookie.set("session", "", { expires: new Date(0) });
  cookie.set("refreshToken", "", { expires: new Date(0) });
  // clearAccessToken(); // Clear in-memory token on logout
}

export async function getSession() {
  const cookie = await cookies();
  const session = cookie.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// export async function updateSession(request: NextRequest) {
//   const session = request.cookies.get("session")?.value;
//   if (!session) return;

//   // Refresh the session so it doesn't expire
//   const parsed = await decrypt(session);
//   parsed.expires = new Date(Date.now() + 10 * 1000);
//   const res = NextResponse.next();
//   res.cookies.set({
//     name: "session",
//     value: await encrypt(parsed),
//     httpOnly: true,
//     expires: parsed.expires,
//   });
//   return res;
// }
