import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { useExport } from '../hooks/useExport';
import { useKPIs } from '../hooks/useKPIs';
import {
  clientesKPIs,
  mockClientes,
} from '../lib/mock-data/kpis';
import type { Cliente } from '../types';

/* -------------------------------------------------------------------------- */
/*  Inline chart data                                                         */
/* -------------------------------------------------------------------------- */

const topClientes = [
  { nome: 'Metalúrgica Silva', volume: 420000 },
  { nome: 'Ind. Papelão Sul', volume: 380000 },
  { nome: 'TechParts Ltda', volume: 210000 },
  { nome: 'AutoPeças Braga', volume: 180000 },
  { nome: 'Embalagens Nova', volume: 95000 },
];

const segmentacaoSetor = [
  { name: 'Indústria', value: 45, fill: '#3b82f6' },
  { name: 'Tecnologia', value: 18, fill: '#10b981' },
  { name: 'Automotivo', value: 22, fill: '#f59e0b' },
  { name: 'Embalagem', value: 10, fill: '#8b5cf6' },
  { name: 'Outros', value: 5, fill: '#6b7280' },
];

const evolucaoClientes = [
  { month: 'Jun', ativos: 278, novos: 12 },
  { month: 'Jul', ativos: 285, novos: 14 },
  { month: 'Aug', ativos: 290, novos: 10 },
  { month: 'Sep', ativos: 295, novos: 9 },
  { month: 'Oct', ativos: 300, novos: 11 },
  { month: 'Nov', ativos: 304, novos: 8 },
  { month: 'Dec', ativos: 308, novos: 6 },
  { month: 'Jan', ativos: 300, novos: 5 },
  { month: 'Feb', ativos: 305, novos: 9 },
  { month: 'Mar', ativos: 309, novos: 7 },
  { month: 'Apr', ativos: 312, novos: 11 },
  { month: 'May', ativos: 312, novos: 18 },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const clienteColumns = [
  { key: 'nome' as const, label: 'Nome' },
  { key: 'segmento' as const, label: 'Segmento' },
  { key: 'volumeCompras' as const, label: 'Volume Compras' },
  { key: 'frequencia' as const, label: 'Frequência' },
  { key: 'prazoMedio' as const, label: 'Prazo Médio' },
  {
    key: 'classeABC' as const,
    label: 'Classe',
    render: (value: unknown) => {
      const classe = value as Cliente['classeABC'];
      const variantMap: Record<string, 'blue' | 'green' | 'amber'> = { A: 'green', B: 'blue', C: 'amber' };
      return <Badge variant={variantMap[classe] ?? 'amber'}>{classe}</Badge>;
    },
  },
  {
    key: 'statusCredito' as const,
    label: 'Crédito',
    render: (value: unknown) => {
      const credito = value as Cliente['statusCredito'];
      const variantMap: Record<string, 'green' | 'amber' | 'red'> = { OK: 'green', Atenção: 'amber', Bloqueado: 'red' };
      return <Badge variant={variantMap[credito] ?? 'amber'}>{credito}</Badge>;
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Clientes() {
  const { data: kpis } = useKPIs('clientes');
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
          <h1 className="text-2xl font-semibold text-text-primary">Clientes</h1>
          <p className="text-sm text-text-muted mt-1">
            Gestão de carteira e análise de crédito
          </p>
        </div>

        <button
          type="button"
          disabled={exporting}
          onClick={() => exportReport('clientes')}
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
        {(kpis ?? clientesKPIs).map((kpi, i) => (
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
        <Card header="Top Clientes por Volume">
          <BarChart
            data={topClientes}
            dataKey="volume"
            nameKey="nome"
            color="#3b82f6"
            horizontal
          />
        </Card>

        <Card header="Segmentação por Setor">
          <PieChart
            data={segmentacaoSetor}
            innerRadius={55}
            outerRadius={85}
          />
        </Card>

        <Card header="Evolução de Clientes">
          <LineChart
            data={evolucaoClientes}
            dataKeys={[
              { key: 'ativos', color: '#3b82f6', name: 'Ativos' },
              { key: 'novos', color: '#10b981', name: 'Novos' },
            ]}
            xAxisKey="month"
          />
        </Card>

        <Card header="Score Médio de Crédito">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={76} label="Score Crédito" size={200} />
          </div>
        </Card>
      </div>

      {/* ── Data table ───────────────────────────────────────────────────── */}
      <Card header="Cadastro de Clientes">
        <DataTable columns={clienteColumns} data={mockClientes as unknown as Record<string, unknown>[]} />
      </Card>
    </motion.div>
  );
}
