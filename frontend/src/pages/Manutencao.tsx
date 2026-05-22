import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { useKPIs } from '../hooks/useKPIs';
import { useExport } from '../hooks/useExport';
import { useManutencao } from '../hooks/useManutencao';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import type { OrdemServico } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const custoPorAtivo = [
  { ativo: 'Prensa 200T', custo: 18500 },
  { ativo: 'Compressor Atlas', custo: 8200 },
  { ativo: 'Torno CNC', custo: 12400 },
  { ativo: 'Empilhadeira', custo: 4600 },
  { ativo: 'Caldeira', custo: 9800 },
];

const tipoManutencao = [
  { name: 'Corretiva', value: 35, fill: '#ef4444' },
  { name: 'Preventiva', value: 45, fill: '#3b82f6' },
  { name: 'Preditiva', value: 20, fill: '#10b981' },
];

const mtbfMttr = [
  { mes: 'Dez', mtbf: 310, mttr: 5.1 },
  { mes: 'Jan', mtbf: 320, mttr: 4.8 },
  { mes: 'Fev', mtbf: 325, mttr: 4.6 },
  { mes: 'Mar', mtbf: 330, mttr: 4.5 },
  { mes: 'Abr', mtbf: 335, mttr: 4.3 },
  { mes: 'Mai', mtbf: 340, mttr: 4.2 },
];

/* -------------------------------------------------------------------------- */
/*  Calendar grid for preventive maintenance                                  */
/* -------------------------------------------------------------------------- */

const preventiveDays = [3, 7, 10, 14, 17, 21, 24, 28]; // days with scheduled maintenance

const DAYS_OF_WEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const statusVariant = (status: OrdemServico['status']) => {
  const map: Record<OrdemServico['status'], 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
    Aberta: 'gray',
    'Em andamento': 'blue',
    Vencida: 'red',
    Concluída: 'green',
  };
  return map[status];
};

const prioridadeVariant = (p: OrdemServico['prioridade']) => {
  const map: Record<OrdemServico['prioridade'], 'red' | 'amber' | 'green'> = {
    Alta: 'red',
    Média: 'amber',
    Baixa: 'green',
  };
  return map[p];
};

const tipoVariant = (t: OrdemServico['tipo']) => {
  const map: Record<OrdemServico['tipo'], 'red' | 'blue' | 'green'> = {
    Corretiva: 'red',
    Preventiva: 'blue',
    Preditiva: 'green',
  };
  return map[t];
};

const columns = [
  { key: 'id' as const, label: 'OS' },
  { key: 'equipamento' as const, label: 'Equipamento' },
  {
    key: 'tipo' as const,
    label: 'Tipo',
    render: (value: OrdemServico['tipo']) => (
      <Badge variant={tipoVariant(value)}>{value}</Badge>
    ),
  },
  {
    key: 'prioridade' as const,
    label: 'Prioridade',
    render: (value: OrdemServico['prioridade']) => (
      <Badge variant={prioridadeVariant(value)}>{value}</Badge>
    ),
  },
  { key: 'abertura' as const, label: 'Abertura' },
  { key: 'prevConclusao' as const, label: 'Previsão' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: OrdemServico['status']) => (
      <Badge variant={statusVariant(value)}>{value}</Badge>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Manutencao() {
  const { data: kpis, isLoading: kpiLoading, error: kpiError, refetch: refetchKPIs } = useKPIs('manutencao');
  const { data: ordens, isLoading: dataLoading, error: dataError, refetch: refetchData } = useManutencao();
  const { exporting, exportReport } = useExport();

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;
  const refetch = () => { refetchKPIs(); refetchData(); };

  if (isLoading) return <LoadingSkeleton kpiCount={6} chartCount={4} tableRows={3} />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!ordens?.length) return <EmptyState title="Nenhuma ordem de serviço" subtitle="Não há ordens de serviço no período selecionado." />;

  const displayKPIs = kpis || [];

  const calendarCells = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDayIdx = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: { day: number | null; hasMaintenance: boolean }[] = [];
    for (let i = 0; i < firstDayIdx; i++) {
      cells.push({ day: null, hasMaintenance: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, hasMaintenance: preventiveDays.includes(d) });
    }
    return cells;
  }, []);

  const monthLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-6 p-6 h-full overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Manutenção</h1>
          <p className="text-sm text-text-muted mt-1">
            Ordens de serviço, disponibilidade e programa preventivo
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          loading={exporting}
          onClick={() => exportReport('manutencao')}
        >
          Exportar
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
        <Card header="Custo por Ativo (R$)">
          <BarChart
            data={custoPorAtivo}
            dataKey="custo"
            nameKey="ativo"
            color="#f59e0b"
            horizontal
          />
        </Card>

        <Card header="Tipo de Manutenção">
          <PieChart data={tipoManutencao} />
        </Card>

        <Card header="MTBF (h) & MTTR (h)">
          <LineChart
            data={mtbfMttr}
            dataKeys={[
              { key: 'mtbf', color: '#3b82f6', name: 'MTBF (h)' },
              { key: 'mttr', color: '#ef4444', name: 'MTTR (h)' },
            ]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Disponibilidade">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={92.1} label="Disponibilidade" size={200} />
          </div>
        </Card>
      </div>

      {/* Calendar + Table section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <Card header={`Preventiva — ${monthLabel}`}>
          <div className="grid grid-cols-7 gap-1">
            {/* Day-of-week headers */}
            {DAYS_OF_WEEK.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-medium text-text-muted py-1"
              >
                {d}
              </div>
            ))}

            {/* Calendar cells */}
            {calendarCells.map((cell, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col items-center justify-center rounded-lg py-2 text-xs transition-colors ${
                  cell.day === null
                    ? ''
                    : 'hover:bg-bg-tertiary cursor-default'
                }`}
              >
                {cell.day !== null && (
                  <>
                    <span className="text-text-secondary">{cell.day}</span>
                    {cell.hasMaintenance && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue" />
              <span className="text-[10px] text-text-muted">Preventiva agendada</span>
            </div>
          </div>
        </Card>

        {/* Table */}
        <div className="lg:col-span-2">
          <Card header="Ordens de Serviço">
            <DataTable columns={columns} data={ordens as unknown as Record<string, unknown>[]} />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
