"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// // Server-side error logging utility
// function logServerError(error: any, context: string, data?: any) {
//   // Log to server console (visible in terminal/Next.js dev output)
//   console.error(`[Server Error] ${context}:`, {
//     message: error?.message || "Unknown error",
//     status: error?.response?.status || error?.status,
//     data: error?.response?.data,
//     config: error?.config,
//     timestamp: new Date().toISOString(),
//     requestData: data,
//   });

//   // Return error info to be logged on client
//   return {
//     serverMessage: error?.response?.data?.message || error?.message,
//     serverStatus: error?.response?.status,
//     serverData: error?.response?.data,
//   };
// }

//Không được xóa async
export async function decrypt(token: string): Promise<any> {
  const payload = jwtDecode(token);
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
      status: 200,
      message: "Register successful",
      data: res.data,
    };
  } catch (error: any) {
    // Return error object instead of throwing for consistent handling
    const status: number = error?.response?.status;
    let message = "Registration failed. Please try again.";

    // Provide more specific error messages based on API error handling guide
    if (status === 422) {
      // The API returns plain text error messages for validation failures
      // e.g., "Username minimum 6 characters", "Password minimum 6 characters", "Password don't match"
      message =
        error?.response?.data ||
        "Invalid input. Please check your information.";
    } else if (status === 409) {
      message = "Username already taken. Please choose a different username.";
    } else if (status === 400) {
      message = "Registration failed. Please try again.";
    }

    return {
      success: false,
      status: status || 500,
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
      status: 200,
      message: "Login successful",
    };
  } catch (error: any) {
    // // Log error to server console for debugging (server-side only)
    // logServerError(error, "Login", {
    //   username: data.username,
    // });

    // Return error object instead of throwing for better handling
    const status = error?.response?.status;
    let message = "Login failed. Please try again.";

    // IMPORTANT: Do NOT distinguish between "username not found" and "incorrect password"
    // Always show a generic message for security reasons (prevents username enumeration).
    // The API returns 401 for both cases, and we never reveal which one occurred.
    if (status === 401) {
      message = "Invalid username or password";
    } else if (status === 400) {
      message = "Login failed. Please try again.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function logout() {
  const cookie = await cookies();
  cookie.set("session", "", { expires: new Date(0) });
  cookie.set("refreshToken", "", { expires: new Date(0) });
}

export async function getSession() {
  const cookie = await cookies();
  const session = cookie.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}
