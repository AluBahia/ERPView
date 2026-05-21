type StatusDotStatus = "ok" | "warn" | "danger";

interface StatusDotProps {
  status: StatusDotStatus;
}

const statusMap: Record<StatusDotStatus, string> = {
  ok: "bg-green",
  warn: "bg-amber",
  danger: "bg-red",
};

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${statusMap[status]}`}
      aria-label={status}
    />
  );
}
