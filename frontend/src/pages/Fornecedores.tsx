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
import { useFornecedores } from '../hooks/useFornecedores';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

/* -------------------------------------------------------------------------- */
/*  Inline chart data                                                         */
/* -------------------------------------------------------------------------- */

const rankingPerformance = [
  { nome: 'Componentes Max', score: 4.7 },
  { nome: 'Aço Forte Ltda', score: 4.5 },
  { nome: 'PackMaster', score: 4.1 },
  { nome: 'Química Beta', score: 3.8 },
  { nome: 'Lubrificantes Pro', score: 3.2 },
];

const categorias = [
  { name: 'Matéria-prima', value: 34, fill: '#3b82f6' },
  { name: 'Insumos', value: 22, fill: '#10b981' },
  { name: 'Componentes', value: 18, fill: '#8b5cf6' },
  { name: 'Embalagem', value: 14, fill: '#f59e0b' },
  { name: 'Manutenção', value: 12, fill: '#6b7280' },
];

const evolucaoFornecedores = [
  { month: 'Jun', entregues: 88, atrasados: 12 },
  { month: 'Jul', entregues: 90, atrasados: 10 },
  { month: 'Aug', entregues: 87, atrasados: 13 },
  { month: 'Sep', entregues: 91, atrasados: 9 },
  { month: 'Oct', entregues: 89, atrasados: 11 },
  { month: 'Nov', entregues: 92, atrasados: 8 },
  { month: 'Dec', entregues: 93, atrasados: 7 },
  { month: 'Jan', entregues: 90, atrasados: 10 },
  { month: 'Feb', entregues: 91, atrasados: 9 },
  { month: 'Mar', entregues: 93, atrasados: 7 },
  { month: 'Apr', entregues: 92, atrasados: 8 },
  { month: 'May', entregues: 91, atrasados: 9 },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const fornecedorColumns = [
  { key: 'nome' as const, label: 'Fornecedor' },
  { key: 'categoria' as const, label: 'Categoria' },
  {
    key: 'avaliacao' as const,
    label: 'Avaliação',
    render: (value: unknown) => {
      const avaliacao = value as number;
      return (
        <span className="flex items-center gap-1">
          <span className="text-amber">★</span>
          <span className="text-text-primary">{avaliacao.toFixed(1)}</span>
        </span>
      );
    },
  },
  {
    key: 'homologacao' as const,
    label: 'Homologação',
    render: (value: unknown) => {
      const homologacao = value as string;
      const variantMap: Record<string, 'green' | 'amber' | 'red'> = {
        Homologado: 'green',
        Condicional: 'amber',
        'Não homologado': 'red',
      };
      return <Badge variant={variantMap[homologacao] ?? 'amber'}>{homologacao}</Badge>;
    },
  },
  {
    key: 'documentacao' as const,
    label: 'Documentação',
    render: (value: unknown) => {
      const doc = value as string;
      const variantMap: Record<string, 'green' | 'amber' | 'red'> = {
        OK: 'green',
        Vencendo: 'amber',
        Vencida: 'red',
      };
      return <Badge variant={variantMap[doc] ?? 'amber'}>{doc}</Badge>;
    },
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Fornecedores() {
  const { data: kpis, isLoading: kpiLoading, error: kpiError, refetch: refetchKPIs } = useKPIs('fornecedores');
  const { data: fornecedores, isLoading: dataLoading, error: dataError, refetch: refetchData } = useFornecedores();
  const { exporting, exportReport } = useExport();

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;
  const refetch = () => { refetchKPIs(); refetchData(); };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!fornecedores?.length) return <EmptyState title="Nenhum fornecedor encontrado" subtitle="Não há fornecedores cadastrados no sistema." />;

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
          <h1 className="text-2xl font-semibold text-text-primary">Fornecedores</h1>
          <p className="text-sm text-text-muted mt-1">
            Avaliação de desempenho e gestão de fornecedores
          </p>
        </div>

        <button
          type="button"
          disabled={exporting}
          onClick={() => exportReport('fornecedores')}
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
        <Card header="Ranking de Performance">
          <BarChart
            data={rankingPerformance}
            dataKey="score"
            nameKey="nome"
            color="#8b5cf6"
            horizontal
          />
        </Card>

        <Card header="Avaliação Média">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={81} label="Avaliação Média" size={200} />
          </div>
        </Card>

        <Card header="Evolução de Entregas">
          <LineChart
            data={evolucaoFornecedores}
            dataKeys={[
              { key: 'entregues', color: '#10b981', name: 'No Prazo (%)' },
              { key: 'atrasados', color: '#ef4444', name: 'Atrasados (%)' },
            ]}
            xAxisKey="month"
          />
        </Card>

        <Card header="Categorias">
          <PieChart
            data={categorias}
            innerRadius={55}
            outerRadius={85}
          />
        </Card>
      </div>

      {/* ── Data table ───────────────────────────────────────────────────── */}
      <Card header="Cadastro de Fornecedores">
        <DataTable columns={fornecedorColumns} data={fornecedores as unknown as Record<string, unknown>[]} />
      </Card>
    </motion.div>
  );
}
