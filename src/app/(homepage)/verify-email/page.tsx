import { Icons } from "@/app/components/icons";
import OtpForm from "./OtpForm";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const email = (await searchParams).email;

  return (
    <div className="auth-page otp-page">
      {/* Animated background elements */}
      <div className="auth-background">
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo-container">
              <div className="logo-icon">
                <Icons.GymTracker />
              </div>
            </div>
            <h1>Verify Your Email</h1>
            <p className="auth-subtitle">
              Enter the 6-digit verification code we sent to your email
            </p>
          </div>

          <OtpForm email={email} />

          <div className="auth-footer">
            <p>© 2026 GymTracker. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
