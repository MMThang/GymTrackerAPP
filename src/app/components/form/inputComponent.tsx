"use client";
import { useFormContext } from "react-hook-form";

export default function InputComponent({
  name,
  label,
  placeholder,
  errorTxt,
  type,
  value,
  className,
  onChange,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  errorTxt?: string;
  type?: string;
  value?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  if (type === "hidden") {
    return <input type="hidden" value={value ?? ""} />;
  }

  return (
    <label htmlFor={name} className="input-box">
      <span className="label">{label}</span>
      <input
        {...register(name, { required: errorTxt ?? "This field is required" })}
        placeholder={placeholder}
        type={type ? type : "text"}
        className={`input ${className ? className : ""}`}
        onChange={onChange}
      />
      <span className="error-msg">
        {(errors as any)[name]?.message as string}
      </span>
    </label>
  );
}
