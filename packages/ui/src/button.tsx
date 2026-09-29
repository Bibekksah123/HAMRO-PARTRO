import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-emerald-800 text-white hover:bg-emerald-900"
      : "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
