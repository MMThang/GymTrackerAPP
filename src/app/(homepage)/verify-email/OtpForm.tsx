"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "react-toastify";
import {
  resendVerificationCode,
  verifyEmail,
} from "@/app/actions/user-actions";
import { Button } from "@/app/components/buttons/button";
import {
  clearOtpResendCooldown,
  getOtpResendCooldownSeconds,
  storeOtpResendCooldown,
} from "@/app/utils/utils";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function OtpForm({ email }: { email?: string }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  // Resume the server-calculated cooldown persisted in localStorage so a page
  // refresh continues the countdown instead of restarting it from the top.
  // Falls back to a full cooldown only when nothing was stored for this email.
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);

  const isCooldownRunning = cooldown > 0;
  const isResendDisabled = isResending || isCooldownRunning;

  useEffect(() => {
    if (!email) return;

    const timer = setTimeout(() => {
      const remaining = getOtpResendCooldownSeconds(email);
      setCooldown(remaining === null ? RESEND_COOLDOWN : remaining);
    }, 0);

    return () => clearTimeout(timer);
  }, [email]);

  // Resend cooldown countdown
  useEffect(() => {
    if (!isCooldownRunning) return;

    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isCooldownRunning]);

  const handleVerify = async (code: string) => {
    if (!email) return;

    setIsVerifying(true);
    try {
      const result = await verifyEmail({ email, otp: code });

      if (result?.success === true) {
        clearOtpResendCooldown(email);
        toast.success(result?.message || "Email verified successfully!");
        router.push("/login");
      } else {
        toast.error(
          result?.message || "Verification failed. Please try again.",
        );
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || isResendDisabled) return;

    setIsResending(true);
    try {
      const result = await resendVerificationCode({ email });

      if (result?.success === true) {
        toast.success(result?.message || "Verification code resent!");
        // Persist the new server-calculated resend expiry and enforce it.
        storeOtpResendCooldown(email, result?.data?.resendCooldownTimeStamp);
        const remaining = getOtpResendCooldownSeconds(email);
        setCooldown(remaining === null ? RESEND_COOLDOWN : remaining);
      } else {
        toast.error(result?.message || "Failed to resend verification code.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="otp-missing-email">
        <p>We could not find the email used for registration.</p>
        <div className="otp-footer">
          <Button
            p="Go to Register"
            type="redirect"
            href="register"
            className="primary-btn"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="otp-form">
      <div className="otp-input-wrapper">
        <OTPInput
          value={otp}
          onChange={setOtp}
          onComplete={(code) => handleVerify(code as string)}
          maxLength={OTP_LENGTH}
          pattern={REGEXP_ONLY_DIGITS}
          placeholder="•"
          autoFocus
          inputMode="numeric"
          containerClassName="otp-slots"
          render={({ slots }) => (
            <>
              {slots.map((slot, idx) => (
                <div
                  key={idx}
                  className={`otp-slot${slot.isActive ? " active" : ""}`}
                >
                  {slot.hasFakeCaret ? (
                    <span className="fake-caret"></span>
                  ) : (
                    (slot.char ?? slot.placeholderChar)
                  )}
                </div>
              ))}
            </>
          )}
        />

        <p className="otp-hint">
          We sent the code to <strong>{email}</strong>
        </p>
      </div>

      <div className="otp-footer">
        <button
          type="button"
          className="primary-btn"
          onClick={() => handleVerify(otp)}
          disabled={isVerifying || otp.length !== OTP_LENGTH}
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </button>

        <div className="additional-btn">
          <p>Didn&apos;t receive the code?</p>
          <button
            type="button"
            className="resend-btn"
            onClick={handleResend}
            disabled={isResendDisabled}
          >
            {isResending
              ? "Resending..."
              : isCooldownRunning
                ? `Resend Code in ${cooldown}s`
                : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
