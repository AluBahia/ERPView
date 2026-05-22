import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { useKPIs } from '../hooks/useKPIs';
import { useExport } from '../hooks/useExport';
import { useProducao } from '../hooks/useProducao';
import { useUIStore } from '../store/uiStore';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import type { OrdemProducao } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const producaoDiaria = [
  { dia: '02/Mai', producao: 420 }, { dia: '03/Mai', producao: 380 },
  { dia: '04/Mai', producao: 510 }, { dia: '05/Mai', producao: 460 },
  { dia: '06/Mai', producao: 490 }, { dia: '07/Mai', producao: 530 },
];

const causasDeParada = [
  { name: 'Manutenção', value: 32, fill: '#ef4444' },
  { name: 'Setup', value: 25, fill: '#f59e0b' },
  { name: 'Falta material', value: 18, fill: '#3b82f6' },
  { name: 'Qualidade', value: 15, fill: '#10b981' },
  { name: 'Outros', value: 10, fill: '#6b7280' },
];

/* -------------------------------------------------------------------------- */
/*  Gantt-like OP display data                                                */
/* -------------------------------------------------------------------------- */

const opBars = [
  { id: '1', produto: 'Flange DN100', start: 5, end: 9, color: '#3b82f6', status: 'Em produção' },
  { id: '2', produto: 'Válvula Gaveta 2"', start: 4, end: 8, color: '#ef4444', status: 'Atrasada' },
  { id: '3', produto: 'Conjunto Vedação K3', start: 3, end: 6, color: '#10b981', status: 'Concluída' },
  { id: '4', produto: 'Tubo Aço 4"', start: 7, end: 12, color: '#6b7280', status: 'Planejada' },
];

const ganttDays = Array.from({ length: 14 }, (_, i) => i + 1);

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const statusVariant = (status: OrdemProducao['status']) => {
  const map: Record<OrdemProducao['status'], 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
    Planejada: 'gray',
    'Em produção': 'blue',
    Atrasada: 'red',
    Concluída: 'green',
  };
  return map[status];
};

const columns = [
  { key: 'id' as const, label: 'OP' },
  { key: 'produto' as const, label: 'Produto' },
  { key: 'quantidade' as const, label: 'Quantidade' },
  { key: 'inicioPrev' as const, label: 'Início' },
  { key: 'fimPrev' as const, label: 'Fim' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: OrdemProducao['status']) => (
      <Badge variant={statusVariant(value)}>{value}</Badge>
    ),
  },
  { key: 'desvio' as const, label: 'Desvio' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Producao() {
  const { data: kpis, isLoading: kpiLoading, error: kpiError, refetch: refetchKPIs } = useKPIs('producao');
  const { data: ordens, isLoading: dataLoading, error: dataError, refetch: refetchData } = useProducao();
  const { exporting, exportReport } = useExport();
  const { factoryFloorActive, toggleFactoryFloor } = useUIStore();

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;
  const refetch = () => { refetchKPIs(); refetchData(); };

  if (isLoading) return <LoadingSkeleton kpiCount={5} chartCount={4} tableRows={4} />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!ordens?.length) return <EmptyState title="Nenhuma ordem de produção" subtitle="Não há ordens de produção no período selecionado." />;

  const displayKPIs = kpis || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col gap-6 p-6 h-full overflow-y-auto ${
        factoryFloorActive ? 'bg-bg-primary' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Produção</h1>
          <p className="text-sm text-text-muted mt-1">
            Ordens, OEE e acompanhamento de chão de fábrica
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={factoryFloorActive ? 'primary' : 'ghost'}
            size="sm"
            onClick={toggleFactoryFloor}
          >
            {factoryFloorActive ? 'Sair do Chão' : 'Chão de Fábrica'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('producao')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayKPIs.map((kpi) => (
          <KPICard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            trend={kpi.trend}
            up={kpi.up}
            icon={kpi.icon}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Gantt-like OP display */}
        <Card header="Ordens de Produção (Timeline)">
          <div className="flex flex-col gap-3">
            {/* Day header */}
            <div className="flex items-center gap-0 pl-32">
              {ganttDays.map((d) => (
                <div
                  key={d}
                  className="flex-1 text-center text-[10px] text-text-muted min-w-[28px]"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* OP bars */}
            {opBars.map((op) => (
              <div key={op.id} className="flex items-center gap-2">
                <div className="w-32 flex-shrink-0 flex flex-col">
                  <span className="text-xs font-medium text-text-primary truncate">
                    {op.produto}
                  </span>
                  <span className="text-[10px] text-text-muted">{op.status}</span>
                </div>
                <div className="flex-1 relative h-6 bg-bg-tertiary rounded-sm">
                  <div
                    className="absolute top-0 h-full rounded-sm opacity-80"
                    style={{
                      left: `${((op.start - 1) / 14) * 100}%`,
                      width: `${((op.end - op.start + 1) / 14) * 100}%`,
                      backgroundColor: op.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card header="OEE Geral">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={78.3} label="OEE" size={200} />
          </div>
        </Card>

        <Card header="Produção Diária">
          <LineChart
            data={producaoDiaria}
            dataKeys={[{ key: 'producao', color: '#3b82f6', name: 'Produção' }]}
            xAxisKey="dia"
          />
        </Card>

        <Card header="Causas de Parada">
          <PieChart data={causasDeParada} />
        </Card>
      </div>

      {/* Data Section */}
      <Card header="Ordens de Produção">
        <DataTable columns={columns} data={ordens as unknown as Record<string, unknown>[]} />
      </Card>
    </motion.div>
  );
}
