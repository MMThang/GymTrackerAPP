"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

//Không được xóa async
export async function decrypt(token: string): Promise<any> {
  const payload = jwtDecode(token);
  return payload;
}

export async function sendOtpEmail(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const res = await axios.post(
      `${process.env.API_URL}/User/sending-otp-email`,
      {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
    );
    return {
      success: true,
      status: 200,
      message: "Verification code sent to your email",
      data: res.data,
    };
  } catch (error: any) {
    const status: number = error?.response?.status;
    let message = "Failed to send verification code. Please try again.";

    if (status === 422) {
      message =
        error?.response?.data ||
        "Invalid input. Please check your information.";
    } else if (status === 409) {
      message =
        "Email is already registered. Please login or use a different email.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function verifyEmail(data: { email: string; otp: string }) {
  try {
    const res = await axios.post(`${process.env.API_URL}/User/verify-email`, {
      email: data.email,
      otp: data.otp,
    });
    return {
      success: true,
      status: 200,
      message: "Email verified successfully",
      data: res.data,
    };
  } catch (error: any) {
    const status: number = error?.response?.status;
    let message = "Email verification failed. Please try again.";

    if (status === 404) {
      message = "No account found with this email. Please register first.";
    } else if (status === 409) {
      message = "Email is already verified. Please login.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function resendVerificationCode(data: { email: string }) {
  try {
    const res = await axios.post(
      `${process.env.API_URL}/User/resend-verification-code`,
      {
        email: data.email,
      },
    );
    return {
      success: true,
      status: 200,
      message: "Verification code resent",
      data: res.data,
    };
  } catch (error: any) {
    const status: number = error?.response?.status;
    let message = `Failed to resend verification code. Please try again.`;

    if (status === 409) {
      message = "Email is already verified. Please login.";
    }

    return {
      success: false,
      status: status || 500,
      message: message,
    };
  }
}

export async function login(data: { email: string; password: string }) {
  try {
    const res = await axios.post(`${process.env.API_URL}/User/login`, {
      email: data.email,
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

    if (status === 401) {
      message = "Invalid email or password";
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
