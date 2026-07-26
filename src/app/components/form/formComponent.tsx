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
    status: number;
    message: string;
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
      if (result?.success === true) {
        setErrorMessage(null);
        router.push(redirectTo ? redirectTo : "/login");
      } else {
        // Log the result for debugging (only in development)
        if (process.env.NODE_ENV === "development") {
          console.error("[Form Submit] Server response:", result);
        }
        setErrorMessage(result?.message || "An error occurred");
      }
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
