import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "neutral" | "danger";
  wide?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "neutral",
  wide,
  icon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant}${wide ? " btn--wide" : ""} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
