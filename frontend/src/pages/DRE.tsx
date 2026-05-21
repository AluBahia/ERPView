import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { FilterBar } from '../components/filters/FilterBar';
import { useExport } from '../hooks/useExport';
import { dreKPIs } from '../lib/mock-data/kpis';

/* -------------------------------------------------------------------------- */
/*  Waterfall data                                                            */
/* -------------------------------------------------------------------------- */

interface WaterfallItem {
  label: string;
  value: number;
  isTotal?: boolean;
}

const waterfallData: WaterfallItem[] = [
  { label: 'Receita Bruta', value: 2850000, isTotal: true },
  { label: '(-) Impostos', value: -430000 },
  { label: '(-) Devoluções', value: -85000 },
  { label: 'Receita Líquida', value: 2335000, isTotal: true },
  { label: '(-) CMV', value: -1210000 },
  { label: '(-) Frete Venda', value: -68000 },
  { label: 'Margem Bruta', value: 1057000, isTotal: true },
  { label: '(-) Desp. Operacionais', value: -485000 },
  { label: '(-) Desp. Pessoal', value: -312000 },
  { label: '(-) Depreciação', value: -78000 },
  { label: 'EBITDA', value: 410000, isTotal: true },
  { label: '(-) Resultado Financeiro', value: -42000 },
  { label: 'Lucro Líquido', value: 368000, isTotal: true },
];

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const margensMensal = [
  { mes: 'Jan', bruta: 36, liquida: 12 },
  { mes: 'Fev', bruta: 37, liquida: 11.5 },
  { mes: 'Mar', bruta: 38, liquida: 12.2 },
  { mes: 'Abr', bruta: 37.5, liquida: 12.6 },
  { mes: 'Mai', bruta: 38.2, liquida: 12.8 },
];

const realizadoVsOrcado = [
  { conta: 'Receita', orcado: 2800000, realizado: 2850000 },
  { conta: 'CMV', orcado: 1250000, realizado: 1210000 },
  { conta: 'Desp. Operac.', orcado: 500000, realizado: 485000 },
  { conta: 'Desp. Pessoal', orcado: 320000, realizado: 312000 },
  { conta: 'EBITDA', orcado: 380000, realizado: 410000 },
];

const composicaoCustos = [
  { name: 'CMV', value: 55, fill: 'var(--color-blue)' },
  { name: 'Desp. Operacionais', value: 22, fill: 'var(--color-green)' },
  { name: 'Desp. Pessoal', value: 14, fill: 'var(--color-amber)' },
  { name: 'Depreciação', value: 4, fill: 'var(--color-red)' },
  { name: 'Financeiro', value: 5, fill: '#8b5cf6' },
];

/* -------------------------------------------------------------------------- */
/*  Waterfall chart (custom horizontal bars)                                  */
/* -------------------------------------------------------------------------- */

function WaterfallChart({ data }: { data: WaterfallItem[] }) {
  const maxValue = Math.max(...data.map((d) => Math.abs(d.value)));
  const totalWidth = 100;

  let cumulative = 0;
  const rows = data.map((item) => {
    const isPositive = item.value >= 0;
    let barLeft: number;
    let barWidth: number;

    if (item.isTotal) {
      barLeft = 0;
      barWidth = (Math.abs(item.value) / maxValue) * totalWidth;
    } else {
      if (isPositive) {
        barLeft = (cumulative / maxValue) * totalWidth;
        barWidth = (item.value / maxValue) * totalWidth;
        cumulative += item.value;
      } else {
        cumulative += item.value;
        barLeft = (cumulative / maxValue) * totalWidth;
        barWidth = (Math.abs(item.value) / maxValue) * totalWidth;
      }
    }

    return { ...item, barLeft, barWidth, isPositive };
  });

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-xs text-text-muted w-32 shrink-0 text-right truncate">
            {row.label}
          </span>
          <div className="flex-1 relative h-6">
            <div
              className={`absolute top-0 h-full rounded-sm ${
                row.isTotal
                  ? 'bg-blue/60'
                  : row.isPositive
                    ? 'bg-green/70'
                    : 'bg-red/70'
              }`}
              style={{
                left: `${row.barLeft}%`,
                width: `${row.barWidth}%`,
              }}
            />
          </div>
          <span
            className={`text-xs font-medium w-24 text-right shrink-0 ${
              row.isPositive ? 'text-green' : 'text-red'
            } ${row.isTotal ? 'font-bold !text-text-primary' : ''}`}
          >
            {row.value >= 0 ? '' : '- '}R${' '}
            {Math.abs(row.value).toLocaleString('pt-BR')}
          </span>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function DRE() {
  const { exporting, exportReport } = useExport();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            DRE &amp; Resultado
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Demonstrativo de resultado, margens e realizado vs orçado
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('dre')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {dreKPIs.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Waterfall */}
        <Card header="DRE Waterfall" className="lg:col-span-2">
          <WaterfallChart data={waterfallData} />
        </Card>

        <Card header="Evolução das Margens (%)">
          <LineChart
            data={margensMensal}
            dataKeys={[
              { key: 'bruta', color: 'var(--color-green)', name: 'Margem Bruta' },
              { key: 'liquida', color: 'var(--color-blue)', name: 'Margem Líquida' },
            ]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Realizado vs Orçado">
          <BarChart
            data={realizadoVsOrcado}
            dataKey="realizado"
            nameKey="conta"
            color="var(--color-green)"
            horizontal
          />
        </Card>

        <Card header="Composição dos Custos">
          <PieChart data={composicaoCustos} />
        </Card>
      </div>
    </motion.div>
  );
}
