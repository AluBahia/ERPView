import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  header?: ReactNode;
}

export function Card({ children, className = "", header }: CardProps) {
  return (
    <div
      className={`bg-bg-secondary border border-border rounded-xl p-4 hover:border-border-subtle transition-colors ${className}`}
    >
      {header && (
        <div className="mb-3 text-text-primary font-medium">{header}</div>
      )}
      {children}
    </div>
  );
}
