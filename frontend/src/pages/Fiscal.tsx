import { useMemo } from 'react';
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
import { useKPIs } from '../hooks/useKPIs';
import { useFiscal } from '../hooks/useFiscal';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { statusToBadgeVariant } from '../lib/formatters';
import { fiscalKPIs } from '../lib/mock-data/kpis';
import type { NFiscal } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const impostosPorTipo = [
  { tipo: 'ICMS', valor: 142000 },
  { tipo: 'PIS', valor: 38000 },
  { tipo: 'COFINS', valor: 68000 },
  { tipo: 'IPI', valor: 52000 },
  { tipo: 'IRPJ', valor: 48000 },
  { tipo: 'CSLL', valor: 39000 },
];

const cargaTributaria = [
  { mes: 'Jan', percentual: 13.2 },
  { mes: 'Fev', percentual: 13.5 },
  { mes: 'Mar', percentual: 13.1 },
  { mes: 'Abr', percentual: 13.8 },
  { mes: 'Mai', percentual: 13.6 },
];

const porOperacao = [
  { name: 'Vendas Internas', value: 48, fill: 'var(--color-blue)' },
  { name: 'Vendas Interestaduais', value: 22, fill: 'var(--color-green)' },
  { name: 'Exportação', value: 10, fill: 'var(--color-amber)' },
  { name: 'Compras', value: 20, fill: 'var(--color-red)' },
];

/* -------------------------------------------------------------------------- */
/*  Calendar data                                                             */
/* -------------------------------------------------------------------------- */

interface FiscalObligation {
  day: number;
  label: string;
  color: string;
}

const fiscalObligations: FiscalObligation[] = [
  { day: 5, label: 'DCTF', color: 'var(--color-blue)' },
  { day: 10, label: 'EFD Contribuições', color: 'var(--color-green)' },
  { day: 15, label: 'SPED Fiscal', color: 'var(--color-amber)' },
  { day: 15, label: 'GIA', color: 'var(--color-red)' },
  { day: 20, label: 'ICMS-ST', color: 'var(--color-amber)' },
  { day: 25, label: 'DIRF', color: 'var(--color-blue)' },
  { day: 30, label: 'ECD', color: 'var(--color-green)' },
];

/* -------------------------------------------------------------------------- */
/*  Calendar component                                                        */
/* -------------------------------------------------------------------------- */

function FiscalCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const obligationsMap = useMemo(() => {
    const map: Record<number, FiscalObligation[]> = {};
    fiscalObligations.forEach((ob) => {
      if (!map[ob.day]) map[ob.day] = [];
      map[ob.day].push(ob);
    });
    return map;
  }, []);

  const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-text-primary capitalize">{monthName}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdays.map((wd) => (
          <span key={wd} className="text-[11px] font-medium text-text-muted py-1">
            {wd}
          </span>
        ))}
        {cells.map((day, idx) => (
          <div
            key={idx}
            className={`min-h-[3.5rem] rounded-md p-1 text-left ${
              day ? 'bg-bg-tertiary/50' : ''
            }`}
          >
            {day && (
              <>
                <span className="text-xs text-text-muted">{day}</span>
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {obligationsMap[day]?.map((ob, oi) => (
                    <span
                      key={oi}
                      className="text-[10px] leading-tight rounded px-1 py-0.5 truncate text-white"
                      style={{ backgroundColor: ob.color }}
                    >
                      {ob.label}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const columns = [
  { key: 'numero' as const, label: 'NF' },
  { key: 'contraparte' as const, label: 'Contraparte' },
  { key: 'data' as const, label: 'Data' },
  { key: 'valor' as const, label: 'Valor' },
  {
    key: 'tipo' as const,
    label: 'Tipo',
    render: (value: NFiscal['tipo']) => (
      <Badge variant={value === 'Entrada' ? 'blue' : 'green'}>{value}</Badge>
    ),
  },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: NFiscal['status']) => (
      <Badge variant={statusToBadgeVariant(value)}>{value}</Badge>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Fiscal() {
  const { data: kpis, isLoading: kpiLoading, error: kpiError, refetch: refetchKPIs } = useKPIs('fiscal');
  const { data: notas, isLoading: dataLoading, error: dataError, refetch: refetchData } = useFiscal();
  const { exporting, exportReport } = useExport();

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;
  const refetch = () => { refetchKPIs(); refetchData(); };

  if (isLoading) return <LoadingSkeleton kpiCount={5} chartCount={4} tableRows={4} />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const displayKPIs = kpis || fiscalKPIs;

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
            Fiscal &amp; Tributário
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Obrigações acessórias, impostos e notas fiscais
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('fiscal')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {displayKPIs.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card header="Impostos por Tipo">
          <BarChart
            data={impostosPorTipo}
            dataKey="valor"
            nameKey="tipo"
            color="var(--color-amber)"
          />
        </Card>

        <Card header="Carga Tributária (%)">
          <LineChart
            data={cargaTributaria}
            dataKeys={[
              { key: 'percentual', color: 'var(--color-red)', name: 'Carga Trib.' },
            ]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Créditos Tributários">
          <GaugeChart value={62} label="Créditos R$ 124k" />
        </Card>

        <Card header="Por Operação">
          <PieChart data={porOperacao} />
        </Card>
      </div>

      {/* Fiscal calendar */}
      <Card header="Calendário de Obrigações Fiscais">
        <FiscalCalendar />
      </Card>

      {/* DataTable */}
      <Card header="Notas Fiscais">
        <DataTable columns={columns} data={notas as unknown as Record<string, unknown>[]} />
      </Card>
    </motion.div>
  );
}
