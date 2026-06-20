"use client";
import { toast } from "react-toastify";
import FormComponent from "../../components/form/formComponent";
import { register } from "../../actions/user-actions";

export default function RegisterFormWrapper({ children }: { children?: any }) {
  const handleRegister = async (formData: any) => {
    const result = await register(formData);

    if (result?.success === true) {
      toast.success("Account created successfully!");
    } else {
      toast.error(result?.message || "An error occurred");
    }

    return result;
  };

  return (
    <FormComponent onSubmit={handleRegister} redirectTo="/login">
      {children}
    </FormComponent>
  );
}
