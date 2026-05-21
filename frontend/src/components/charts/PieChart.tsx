import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface PieDataItem {
  name: string;
  value: number;
  fill: string;
}

export interface PieChartProps {
  data: PieDataItem[];
  innerRadius?: number;
  outerRadius?: number;
  height?: number;
}

/* -------------------------------------------------------------------------- */
/*  Custom tooltip                                                            */
/* -------------------------------------------------------------------------- */

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: PieDataItem }[];
}) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-text-primary">
        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.payload.fill }} />
        {entry.name}: {entry.value.toLocaleString('pt-BR')}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Custom legend                                                             */
/* -------------------------------------------------------------------------- */

function ChartLegend({ payload }: { payload?: { value: string; color: string }[] }) {
  if (!payload) return null;
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, i) => (
        <span key={i} className="flex items-center gap-1.5 text-xs text-text-secondary">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function PieChart({
  data,
  innerRadius = 60,
  outerRadius = 90,
  height = 300,
}: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend content={<ChartLegend />} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
