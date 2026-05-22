import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { useExport } from '../hooks/useExport';
import { useKPIs } from '../hooks/useKPIs';
import { useVendas } from '../hooks/useVendas';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import {
  topVendedores,
} from '../lib/mock-data/kpis';

/* -------------------------------------------------------------------------- */
/*  Inline chart data                                                         */
/* -------------------------------------------------------------------------- */

const faturamentoDiario = [
  { day: '01/Mai', valor: 42000 },
  { day: '02/Mai', valor: 38500 },
  { day: '03/Mai', valor: 51200 },
  { day: '04/Mai', valor: 44800 },
  { day: '05/Mai', valor: 47300 },
  { day: '06/Mai', valor: 53100 },
  { day: '07/Mai', valor: 125400 },
];

const funnelSteps = [
  { label: 'Orçamentos', count: 148, pct: 100 },
  { label: 'Propostas', count: 92, pct: 62 },
  { label: 'Negociação', count: 61, pct: 41 },
  { label: 'Fechados', count: 47, pct: 32 },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const pedidoColumns = [
  { key: 'numero' as const, label: 'Pedido' },
  { key: 'cliente' as const, label: 'Cliente' },
  { key: 'data_pedido' as const, label: 'Data' },
  { key: 'valor_total' as const, label: 'Valor' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: unknown) => {
      const status = value as string;
      const variantMap: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
        'Aberto': 'blue',
        'Em produção': 'amber',
        'Expedido': 'green',
        'Faturado': 'green',
        'Cancelado': 'red',
      };
      return <Badge variant={variantMap[status] ?? 'gray'}>{status}</Badge>;
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Vendas() {
  const { data: kpis, isLoading: kpiLoading, error: kpiError, refetch: refetchKPIs } = useKPIs('vendas');
  const { data: pedidos, isLoading: dataLoading, error: dataError, refetch: refetchData } = useVendas();
  const { exporting, exportReport } = useExport();

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;
  const refetch = () => { refetchKPIs(); refetchData(); };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!pedidos?.length) return <EmptyState title="Nenhum pedido encontrado" subtitle="Não há pedidos de venda no período selecionado." />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Vendas</h1>
          <p className="text-sm text-text-muted mt-1">
            Acompanhamento de pedidos e desempenho comercial
          </p>
        </div>

        <button
          type="button"
          disabled={exporting}
          onClick={() => exportReport('vendas')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
          </svg>
          {exporting ? 'Exportando...' : 'Exportar Relatório'}
        </button>
      </div>

      {/* ── KPI grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(kpis || []).map((kpi, i) => (
          <KPICard
            key={i}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            up={kpi.up}
            icon={<span className="text-lg">{kpi.icon}</span>}
            color={kpi.color}
          />
        ))}
      </div>

      {/* ── Charts grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card header="Faturamento Diário">
          <LineChart
            data={faturamentoDiario}
            dataKeys={[{ key: 'valor', color: '#3b82f6', name: 'Faturamento' }]}
            xAxisKey="day"
          />
        </Card>

        <Card header="Vendedores">
          <BarChart
            data={topVendedores}
            dataKey="valor"
            nameKey="nome"
            color="#10b981"
            horizontal
          />
        </Card>

        <Card header="Funil de Vendas">
          <div className="flex flex-col gap-2 py-2">
            {funnelSteps.map((step) => (
              <div key={step.label} className="flex items-center gap-3">
                <span className="w-24 text-xs text-text-muted text-right shrink-0">
                  {step.label}
                </span>
                <div className="flex-1 h-8 rounded-md bg-bg-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-md bg-blue/60 flex items-center px-3"
                    style={{ width: `${step.pct}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      {step.count}
                    </span>
                  </div>
                </div>
                <span className="w-10 text-xs text-text-muted text-right">
                  {step.pct}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card header="Meta de Faturamento">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={73} label="Meta Mensal" size={200} />
          </div>
        </Card>
      </div>

      {/* ── Data table ───────────────────────────────────────────────────── */}
      <Card header="Pedidos de Venda">
        <DataTable columns={pedidoColumns} data={pedidos as unknown as Record<string, unknown>[]} />
      </Card>
    </motion.div>
  );
}
