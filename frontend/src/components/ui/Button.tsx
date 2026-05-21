import { type ReactNode } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: "bg-blue text-white hover:bg-blue-dim",
  ghost:
    "bg-transparent border border-border-subtle text-text-secondary hover:bg-bg-tertiary",
  danger: "bg-red/10 text-red border border-red/20 hover:bg-red/18",
};

const sizeMap: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue/50 disabled:opacity-60 disabled:cursor-not-allowed ${variantMap[variant]} ${sizeMap[size]} ${className}`}
    >
      {children}
      {loading && <span className="ml-1 animate-pulse">...</span>}
    </button>
  );
}
