//Creating this file to use toastify, do not delete
"use client";
import { toast } from "react-toastify";
import FormComponent from "../../components/form/formComponent";
import { sendOtpEmail } from "../../actions/user-actions";
import { storeOtpResendCooldown } from "../../utils/utils";
import { useRouter } from "next/navigation";

export default function RegisterFormWrapper({ children }: { children?: any }) {
  const router = useRouter();
  const handleSendingOtpEmail = async (formData: any) => {
    const result = await sendOtpEmail(formData);

    if (result?.success === true) {
      toast.success("An OTP has been sent to you email");
      // Persist the server-calculated resend cooldown so the OTP page
      // resumes the countdown instead of restarting it from 60s.
      storeOtpResendCooldown(
        formData.email,
        result?.data?.resendCooldownTimeStamp,
      );
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } else {
      toast.error(result?.message || "An error occurred");
    }

    return result;
  };

  return (
    <FormComponent onSubmit={handleSendingOtpEmail}>{children}</FormComponent>
  );
}
