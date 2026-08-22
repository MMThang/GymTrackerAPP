"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

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

    cookie.set("session", res.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    cookie.set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return {
      success: true,
      status: 200,
      message: "Login successful",
    };
  } catch (error: any) {
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
      // error: error?.response,
    };
  }
}

export async function loginWithGoogle() {
  return `${process.env.API_URL}/Auth/google`;
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

export async function oauthCodeExchange(code: string) {
  try {
    const res = await axios.post(`${process.env.API_URL}/Auth/oauth/exchange`, {
      code,
    });

    const cookie = await cookies();

    cookie.set("session", res.data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    cookie.set("refreshToken", res.data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    return {
      success: true,
      status: 200,
      message: "Login successful",
      data: res.data,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    let message = "OAuth code exchange failed. Please try again.";

    if (status === 404) {
      message = "OAuth code exchange failed. Please try again.";
    } else if (status === 401) {
      message = "OAuth code exchange failed. Please try again.";
    } else if (status === 400) {
      message = "OAuth code exchange failed. Please try again.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}
