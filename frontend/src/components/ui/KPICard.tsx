import { type ReactNode } from "react";
import { motion } from "framer-motion";

type KPICardColor = "blue" | "green" | "amber" | "red";

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: string;
  up?: boolean;
  icon: ReactNode;
  color: KPICardColor;
}

const colorMap: Record<KPICardColor, { bg: string; icon: string }> = {
  blue: {
    bg: "rgba(59,130,246,.12)",
    icon: "text-blue",
  },
  green: {
    bg: "rgba(16,185,129,.12)",
    icon: "text-green",
  },
  amber: {
    bg: "rgba(245,158,11,.12)",
    icon: "text-amber",
  },
  red: {
    bg: "rgba(239,68,68,.12)",
    icon: "text-red",
  },
};

export function KPICard({ label, value, trend, up, icon, color }: KPICardProps) {
  const palette = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-bg-secondary border border-border rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ backgroundColor: palette.bg }}
        >
          <span className={palette.icon}>{icon}</span>
        </span>

        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              up
                ? "bg-green/12 text-green"
                : "bg-red/12 text-red"
            }`}
          >
            {up ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M12 5.23a.75.75 0 011.06-.02l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.04-1.08L15.28 10.5H4a.75.75 0 010-1.5h11.28L12 6.29a.75.75 0 01-.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3 h-3"
              >
                <path
                  fillRule="evenodd"
                  d="M8 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25A.75.75 0 017.98 6.3L4.72 9.5H16a.75.75 0 010 1.5H4.72L8 13.71a.75.75 0 01.02 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-2xl font-semibold text-text-primary tracking-tight">
          {value}
        </span>
        <span className="text-sm text-text-muted mt-0.5">{label}</span>
      </div>
    </motion.div>
  );
}
