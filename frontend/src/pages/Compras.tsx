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
import { comprasKPIs } from '../lib/mock-data/kpis';

/* -------------------------------------------------------------------------- */
/*  Inline chart data                                                         */
/* -------------------------------------------------------------------------- */

const fornecedoresVolume = [
  { nome: 'Aço Forte Ltda', volume: 284000 },
  { nome: 'Química Beta', volume: 152000 },
  { nome: 'PackMaster', volume: 98000 },
  { nome: 'Lubrificantes Pro', volume: 64000 },
  { nome: 'Componentes Max', volume: 127000 },
];

const funnelAprovacao = [
  { label: 'Solicitações', count: 24, pct: 100 },
  { label: 'Cotações', count: 18, pct: 75 },
  { label: 'Em Aprovação', count: 7, pct: 29 },
  { label: 'Aprovadas', count: 14, pct: 58 },
  { label: 'Em Expedição', count: 10, pct: 42 },
];

const evolucaoPrecos = [
  { month: 'Jun', aco: 4200, quimico: 3100 },
  { month: 'Jul', aco: 4350, quimico: 3050 },
  { month: 'Aug', aco: 4500, quimico: 3200 },
  { month: 'Sep', aco: 4400, quimico: 3150 },
  { month: 'Oct', aco: 4600, quimico: 3300 },
  { month: 'Nov', aco: 4700, quimico: 3400 },
  { month: 'Dec', aco: 4800, quimico: 3350 },
  { month: 'Jan', aco: 4900, quimico: 3500 },
  { month: 'Feb', aco: 4850, quimico: 3450 },
  { month: 'Mar', aco: 4950, quimico: 3600 },
  { month: 'Apr', aco: 5100, quimico: 3550 },
  { month: 'May', aco: 5050, quimico: 3600 },
];

const mockPedidosCompra: Record<string, unknown>[] = [
  { id: '1', fornecedor: 'Aço Forte Ltda', categoria: 'Matéria-prima', data: '07/05/2026', valor: 'R$ 82.400', status: 'Pendente' },
  { id: '2', fornecedor: 'Química Beta', categoria: 'Insumos', data: '06/05/2026', valor: 'R$ 15.200', status: 'Aprovado' },
  { id: '3', fornecedor: 'PackMaster', categoria: 'Embalagem', data: '05/05/2026', valor: 'R$ 34.800', status: 'Recebido' },
  { id: '4', fornecedor: 'Componentes Max', categoria: 'Componentes', data: '04/05/2026', valor: 'R$ 56.100', status: 'Aprovado' },
  { id: '5', fornecedor: 'Lubrificantes Pro', categoria: 'Manutenção', data: '03/05/2026', valor: 'R$ 8.900', status: 'Pendente' },
  { id: '6', fornecedor: 'Aço Forte Ltda', categoria: 'Matéria-prima', data: '02/05/2026', valor: 'R$ 127.300', status: 'Recebido' },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const pedidoCompraColumns = [
  { key: 'fornecedor' as const, label: 'Fornecedor' },
  { key: 'categoria' as const, label: 'Categoria' },
  { key: 'data' as const, label: 'Data' },
  { key: 'valor' as const, label: 'Valor' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: unknown) => {
      const status = value as string;
      const variantMap: Record<string, 'blue' | 'green' | 'amber' | 'red'> = {
        Pendente: 'amber',
        Aprovado: 'blue',
        Recebido: 'green',
        Cancelado: 'red',
      };
      return <Badge variant={variantMap[status] ?? 'amber'}>{status}</Badge>;
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Compras() {
  const { data: kpis } = useKPIs('compras');
  const { exporting, exportReport } = useExport();

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
          <h1 className="text-2xl font-semibold text-text-primary">Compras</h1>
          <p className="text-sm text-text-muted mt-1">
            Gestão de pedidos de compra e aprovações
          </p>
        </div>

        <button
          type="button"
          disabled={exporting}
          onClick={() => exportReport('compras')}
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
        {(kpis ?? comprasKPIs).map((kpi, i) => (
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
        <Card header="Fornecedores por Volume">
          <BarChart
            data={fornecedoresVolume}
            dataKey="volume"
            nameKey="nome"
            color="#3b82f6"
            horizontal
          />
        </Card>

        <Card header="Funil de Aprovação">
          <div className="flex flex-col gap-2 py-2">
            {funnelAprovacao.map((step) => (
              <div key={step.label} className="flex items-center gap-3">
                <span className="w-28 text-xs text-text-muted text-right shrink-0">
                  {step.label}
                </span>
                <div className="flex-1 h-8 rounded-md bg-bg-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-md bg-amber/60 flex items-center px-3"
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

        <Card header="Evolução de Preços">
          <LineChart
            data={evolucaoPrecos}
            dataKeys={[
              { key: 'aco', color: '#3b82f6', name: 'Aço (R$/t)' },
              { key: 'quimico', color: '#f59e0b', name: 'Químico (R$/t)' },
            ]}
            xAxisKey="month"
          />
        </Card>

        <Card header="Lead Time Médio">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={68} label="Lead Time" size={200} />
          </div>
        </Card>
      </div>

      {/* ── Data table ───────────────────────────────────────────────────── */}
      <Card header="Pedidos de Compra">
        <DataTable columns={pedidoCompraColumns} data={mockPedidosCompra} />
      </Card>
    </motion.div>
  );
}
