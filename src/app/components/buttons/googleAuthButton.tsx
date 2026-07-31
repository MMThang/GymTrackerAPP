"use client";

import { useState } from "react";
import { loginWithGoogle } from "@/app/actions/user-actions";
import { Icons } from "@/app/components/icons";

export function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);
  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const redirectUrl = await loginWithGoogle();

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="google-btn"
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? <Icons.Spinner /> : <Icons.Google />}
      <span>Continue with Google</span>
    </button>
  );
}
