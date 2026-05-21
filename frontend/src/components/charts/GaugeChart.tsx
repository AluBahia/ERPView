
/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface GaugeChartProps {
  /** 0-100 */
  value: number;
  label: string;
  size?: number;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function getColor(value: number): string {
  if (value >= 80) return '#10b981'; // green
  if (value >= 60) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

function getTextColor(value: number): string {
  if (value >= 80) return 'text-green';
  if (value >= 60) return 'text-amber';
  return 'text-red';
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function GaugeChart({ value, label, size = 180 }: GaugeChartProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 14;
  const strokeWidth = 10;

  const startAngle = 0;
  const endAngle = 180;
  const valueAngle = (clampedValue / 100) * 180;

  const color = getColor(clampedValue);
  const textColor = getTextColor(clampedValue);

  const bgArc = describeArc(cx, cy, radius, startAngle, endAngle);
  const valueArc = describeArc(cx, cy, radius, startAngle, valueAngle);

  /* Small tick at the gauge endpoints */
  const needleAngle = valueAngle;
  const needle = polarToCartesian(cx, cy, radius + 2, needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
        {/* Background arc */}
        <path
          d={bgArc}
          fill="none"
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Value arc */}
        {clampedValue > 0 && (
          <path
            d={valueArc}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        )}

        {/* Endpoint dot */}
        {clampedValue > 0 && (
          <circle cx={needle.x} cy={needle.y} r={4} fill={color} />
        )}

        {/* Center text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`${textColor}`}
          fill="currentColor"
          fontSize={size * 0.18}
          fontWeight={700}
        >
          {Math.round(clampedValue)}%
        </text>

        {/* Label */}
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9ca3af"
          fontSize={size * 0.07}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
