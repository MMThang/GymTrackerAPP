"use client";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { useState } from "react";

export default function FormComponent({
  children,
  className,
  onSubmit,
  redirectTo,
}: {
  children?: any;
  className?: string;
  onSubmit: (data?: any) => Promise<{
    success: boolean;
    data?: any;
    status: string;
    message: string;
    debugInfo?: any; // Optional debug info for error logging
  }>;
  redirectTo?: string;
}) {
  const router = useRouter();
  const methods = useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function clientAction(formData: any) {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await onSubmit(formData);

      // Log the result for debugging (only in development)
      if (process.env.NODE_ENV === "development") {
        console.log("[Form Submit] Server response:", result);
      }

      if (result?.success === true) {
        setErrorMessage(null);
        router.push(redirectTo ? redirectTo : "/login");
      } else {
        // Handle case where success is false but no exception thrown
        // Log detailed error info to browser console
        if (process.env.NODE_ENV === "development") {
          console.error("[Form Error] Server returned error:", {
            message: result?.message,
            status: result?.status,
            debugInfo: result,
          });
        }
        setErrorMessage(result?.message || "An error occurred");
      }
    } catch (error: any) {
      // Log full error details to browser console for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("[Form Error] Exception caught:", {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          fullError: error,
        });
      }

      // Extract error message from different error formats
      let errorMsg = "An unexpected error occurred";

      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message) {
        // Try to parse if it's a JSON string
        try {
          const parsed = JSON.parse(error.message);
          errorMsg = parsed.message || error.message;
        } catch {
          errorMsg = error.message;
        }
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(clientAction)}
        className={`form ${className !== undefined ? className : ""}`}
      >
        {errorMessage && (
          <div className="form-error-message">
            <span className="error-icon">!</span>
            <span>{errorMessage}</span>
            <button
              type="button"
              className="error-dismiss"
              onClick={() => setErrorMessage(null)}
            >
              ×
            </button>
          </div>
        )}
        {children}
        {isLoading && (
          <div className="form-loading-overlay">
            <div className="spinner"></div>
            <span>Processing...</span>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
