"use client";
import { useRouter } from "next/navigation";
import { JSX } from "react";

export function Button({
  type,
  href,
  onClick,
  p,
  className,
}: {
  btnType?: "button" | "text";
  type?: string;
  href?: string;
  onClick?: () => void;
  p: string | JSX.Element;
  className?: string;
}) {
  const router = useRouter();

  if (type === "submit") {
    return (
      <button type="submit" className={className}>
        {p}
      </button>
    );
  } else if (type === "button") {
    return (
      <button onClick={onClick} className={className}>
        {p}
      </button>
    );
  } else if (type === "redirect") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          router.push("/" + href);
        }}
        className={className}
      >
        {p}
      </button>
    );
  }
}
