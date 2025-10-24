// components/ui/button.tsx
import * as React from "react";

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-md transition focus:outline-none px-4 py-2";
  const styles =
    variant === "secondary"
      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
      : "bg-blue-600 text-white hover:bg-blue-700";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
