import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { PieChart } from '../components/charts/PieChart';
import { FilterBar } from '../components/filters/FilterBar';
import { useExport } from '../hooks/useExport';
import { rhKPIs } from '../lib/mock-data/kpis';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const custoPorDepto = [
  { depto: 'Produção', valor: 480000 },
  { depto: 'Administrativo', valor: 220000 },
  { depto: 'Comercial', valor: 185000 },
  { depto: 'Qualidade', valor: 95000 },
  { depto: 'Logística', valor: 140000 },
];

const turnoverMensal = [
  { mes: 'Jan', taxa: 2.1 },
  { mes: 'Fev', taxa: 2.3 },
  { mes: 'Mar', taxa: 2.5 },
  { mes: 'Abr', taxa: 2.6 },
  { mes: 'Mai', taxa: 2.8 },
];

const distribuicaoArea = [
  { name: 'Produção', value: 42, fill: 'var(--color-blue)' },
  { name: 'Administrativo', value: 18, fill: 'var(--color-green)' },
  { name: 'Comercial', value: 16, fill: 'var(--color-amber)' },
  { name: 'Qualidade', value: 8, fill: 'var(--color-red)' },
  { name: 'Logística', value: 11, fill: '#8b5cf6' },
  { name: 'TI', value: 5, fill: '#6366f1' },
];

/* -------------------------------------------------------------------------- */
/*  Vacation calendar data                                                    */
/* -------------------------------------------------------------------------- */

interface Vacation {
  name: string;
  initials: string;
  color: string;
  startDay: number;
  endDay: number;
}

const vacations: Vacation[] = [
  { name: 'Carlos Silva', initials: 'CS', color: 'var(--color-blue)', startDay: 3, endDay: 12 },
  { name: 'Ana Costa', initials: 'AC', color: 'var(--color-green)', startDay: 8, endDay: 17 },
  { name: 'Roberto Lima', initials: 'RL', color: 'var(--color-amber)', startDay: 15, endDay: 26 },
  { name: 'Fernanda Souza', initials: 'FS', color: 'var(--color-red)', startDay: 20, endDay: 30 },
];

/* -------------------------------------------------------------------------- */
/*  Vacation calendar component                                               */
/* -------------------------------------------------------------------------- */

function VacationCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-text-primary capitalize">{monthName}</p>

      {/* Day headers */}
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `5rem repeat(${daysInMonth}, 1fr)` }}>
        <div /> {/* empty corner */}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <span
            key={i}
            className="text-[9px] text-text-muted text-center"
          >
            {i + 1}
          </span>
        ))}
      </div>

      {/* Employee rows */}
      {vacations.map((v) => (
        <div
          key={v.name}
          className="grid gap-0.5 items-center"
          style={{ gridTemplateColumns: `5rem repeat(${daysInMonth}, 1fr)` }}
        >
          <span className="text-xs text-text-secondary truncate" title={v.name}>
            {v.initials}
          </span>
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isOnVacation = day >= v.startDay && day <= v.endDay;
            return (
              <div
                key={day}
                className="h-5 rounded-sm"
                style={{
                  backgroundColor: isOnVacation ? v.color : 'transparent',
                  opacity: isOnVacation ? 0.6 : 1,
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-1">
        {vacations.map((v) => (
          <span key={v.name} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ backgroundColor: v.color, opacity: 0.6 }}
            />
            {v.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RH() {
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
            RH &amp; Folha
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Headcount, custo por departamento, turnover e férias
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('rh')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {rhKPIs.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card header="Custo Folha por Departamento">
          <BarChart
            data={custoPorDepto}
            dataKey="valor"
            nameKey="depto"
            color="var(--color-amber)"
            horizontal
          />
        </Card>

        <Card header="Evolução Turnover (%)">
          <LineChart
            data={turnoverMensal}
            dataKeys={[
              { key: 'taxa', color: 'var(--color-amber)', name: 'Turnover' },
            ]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Absenteísmo">
          <GaugeChart value={4.1} label="4.1%" />
        </Card>

        <Card header="Distribuição por Área">
          <PieChart data={distribuicaoArea} />
        </Card>
      </div>

      {/* Vacation calendar */}
      <Card header="Calendário de Férias">
        <VacationCalendar />
      </Card>
    </motion.div>
  );
}
