import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { useKPIs } from '../hooks/useKPIs';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import {
  faturamentoMensal,
  topVendedores,
  canaisVenda,
} from '../lib/mock-data/kpis';

/* -------------------------------------------------------------------------- */
/*  Inline chart data                                                         */
/* -------------------------------------------------------------------------- */

const criticalAlerts = [
  { id: 1, type: 'red' as const, label: 'Estoque Zerado', description: '8 itens sem saldo disponível', module: 'Estoque' },
  { id: 2, type: 'amber' as const, label: 'OPs Atrasadas', description: '3 ordens de produção fora do prazo', module: 'Produção' },
  { id: 3, type: 'red' as const, label: 'Títulos Vencidos', description: '2 títulos a receber com atraso', module: 'Financeiro' },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  const { data: kpis, isLoading, error, refetch } = useKPIs('dashboard');

  if (isLoading) return <LoadingSkeleton kpiCount={8} chartCount={4} tableRows={3} />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

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
          <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Visão geral do desempenho empresarial
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted">
            Atualizado há 5 min
          </span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-bg-secondary border border-border px-3 py-1.5 text-sm text-text-secondary hover:border-border-subtle hover:text-text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.389l-.011.04zm-10.624-2.848a5.5 5.5 0 019.201-2.466l.312.311h-2.433a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.537a.75.75 0 00-1.5 0v2.033l-.312-.311A7 7 0 002.812 8.187a.75.75 0 001.449.389l.011-.04z" clipRule="evenodd" />
            </svg>
            Atualizar
          </button>
        </div>
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
        <Card header="Faturamento Mensal">
          <LineChart
            data={faturamentoMensal}
            dataKeys={[{ key: 'valor', color: '#3b82f6', name: 'Faturamento' }]}
            xAxisKey="month"
          />
        </Card>

        <Card header="Top Vendedores">
          <BarChart
            data={topVendedores}
            dataKey="valor"
            nameKey="nome"
            color="#10b981"
            horizontal
          />
        </Card>

        <Card header="Canais de Venda">
          <PieChart
            data={canaisVenda}
            innerRadius={55}
            outerRadius={85}
          />
        </Card>

        <Card header="Meta de Faturamento">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={73} label="Meta Mensal" size={200} />
          </div>
        </Card>
      </div>

      {/* ── Critical alerts ──────────────────────────────────────────────── */}
      <Card header="Alertas Críticos">
        <div className="flex flex-col gap-3">
          {criticalAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-lg bg-bg-tertiary border border-border-subtle px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <Badge variant={alert.type}>
                  {alert.type === 'red' ? 'Crítico' : 'Atenção'}
                </Badge>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">
                    {alert.label}
                  </span>
                  <span className="text-xs text-text-muted">
                    {alert.description}
                  </span>
                </div>
              </div>
              <span className="text-xs text-text-muted">{alert.module}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
