import { type ReactNode } from "react";

type BadgeVariant = "blue" | "green" | "amber" | "red" | "gray";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
}

const variantMap: Record<BadgeVariant, string> = {
  blue: "bg-blue/12 text-blue",
  green: "bg-green/12 text-green",
  amber: "bg-amber/12 text-amber",
  red: "bg-red/12 text-red",
  gray: "bg-text-muted/12 text-text-muted",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${variantMap[variant]}`}
    >
      {children}
    </span>
  );
}
