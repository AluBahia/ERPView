import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { PieChart } from '../components/charts/PieChart';
import { FilterBar } from '../components/filters/FilterBar';
import { useExport } from '../hooks/useExport';
import { statusToBadgeVariant } from '../lib/formatters';
import {
  receberKPIs,
  mockTitulosReceber,
} from '../lib/mock-data/kpis';
import type { TituloReceber } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const agingRecebiveis = [
  { faixa: '0-30d', valor: 450000 },
  { faixa: '31-60d', valor: 320000 },
  { faixa: '61-90d', valor: 180000 },
  { faixa: '91-120d', valor: 95000 },
  { faixa: '>120d', valor: 127000 },
];

const recebimentosPrevistos = [
  { semana: 'Sem 1', previsto: 85000, realizado: 78000 },
  { semana: 'Sem 2', previsto: 92000, realizado: 95000 },
  { semana: 'Sem 3', previsto: 110000, realizado: 102000 },
  { semana: 'Sem 4', previsto: 78000, realizado: 81000 },
];

const concentracaoReceber = [
  { name: 'Ind. Papelão', value: 42, fill: 'var(--color-blue)' },
  { name: 'Metal. Silva', value: 28, fill: 'var(--color-green)' },
  { name: 'TechParts', value: 18, fill: 'var(--color-amber)' },
  { name: 'Outros', value: 12, fill: 'var(--color-red)' },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const columns = [
  { key: 'numero' as const, label: 'Título' },
  { key: 'cliente' as const, label: 'Cliente' },
  { key: 'emissao' as const, label: 'Emissão' },
  { key: 'vencimento' as const, label: 'Vencimento' },
  { key: 'valor' as const, label: 'Valor' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: TituloReceber['status']) => (
      <Badge variant={statusToBadgeVariant(value)}>{value}</Badge>
    ),
  },
  {
    key: 'diasAtraso' as const,
    label: 'Atraso',
    render: (value?: string) =>
      value ? <span className="text-red">{value}</span> : '—',
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Receber() {
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
            Contas a Receber
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Acompanhe recebíveis, inadimplência e prazo médio de recebimento
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('receber')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {receberKPIs.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card header="Aging de Recebíveis">
          <BarChart
            data={agingRecebiveis}
            dataKey="valor"
            nameKey="faixa"
            color="var(--color-blue)"
          />
        </Card>

        <Card header="Recebimentos Previstos vs Realizados">
          <LineChart
            data={recebimentosPrevistos}
            dataKeys={[
              { key: 'previsto', color: 'var(--color-blue)', name: 'Previsto' },
              { key: 'realizado', color: 'var(--color-green)', name: 'Realizado' },
            ]}
            xAxisKey="semana"
          />
        </Card>

        <Card header="Prazo Médio de Recebimento">
          <GaugeChart value={38} label="PMR 38 dias" />
        </Card>

        <Card header="Concentração por Cliente">
          <PieChart data={concentracaoReceber} />
        </Card>
      </div>

      {/* DataTable */}
      <Card header="Títulos a Receber">
        <DataTable columns={columns} data={mockTitulosReceber} />
      </Card>
    </motion.div>
  );
}
