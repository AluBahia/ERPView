import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { PieChart } from '../components/charts/PieChart';
import { FilterBar } from '../components/filters/FilterBar';
import { useExport } from '../hooks/useExport';
import { useKPIs } from '../hooks/useKPIs';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { fluxoCaixaKPIs } from '../lib/mock-data/kpis';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const projecaoFluxo = [
  { dia: '01', saldo: 1240000 },
  { dia: '05', saldo: 1180000 },
  { dia: '10', saldo: 1050000 },
  { dia: '15', saldo: 920000 },
  { dia: '18', saldo: -45000 },
  { dia: '20', saldo: 380000 },
  { dia: '25', saldo: 720000 },
  { dia: '30', saldo: 980000 },
];

const saldoPorBanco = [
  { banco: 'Banco do Brasil', valor: 520000 },
  { banco: 'Itaú', valor: 380000 },
  { banco: 'Bradesco', valor: 240000 },
  { banco: 'Santander', valor: 100000 },
];

const composicaoEntradas = [
  { name: 'Receber Clientes', value: 55, fill: 'var(--color-blue)' },
  { name: 'Receb. Antecipado', value: 15, fill: 'var(--color-green)' },
  { name: 'Outras Entradas', value: 18, fill: 'var(--color-amber)' },
  { name: 'Aplicações', value: 12, fill: 'var(--color-red)' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function FluxoCaixa() {
  const { data: kpis, isLoading, error, refetch } = useKPIs('fluxo-caixa');
  const { exporting, exportReport } = useExport();

  if (isLoading) return <LoadingSkeleton kpiCount={5} chartCount={4} tableRows={0} />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const displayKPIs = kpis || fluxoCaixaKPIs;
  const hasNegative = projecaoFluxo.some((p) => p.saldo < 0);

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
            Fluxo de Caixa
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Projeção de saldos, liquidez e composição das entradas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('fluxo-caixa')}
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

      {/* Alert for projected negative balance */}
      {hasNegative && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red/10 border border-red/30 rounded-xl p-4 flex items-center gap-3"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red/20 text-red text-lg">
            &#9888;
          </span>
          <div>
            <p className="text-sm font-semibold text-red">
              Saldo negativo projetado
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              Projeção indica saldo de R$ -45.000 no dia 18. Considere
              antecipar recebimentos ou postergar pagamentos.
            </p>
          </div>
        </motion.div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card header="Projeção de Fluxo de Caixa">
          <LineChart
            data={projecaoFluxo}
            dataKeys={[
              { key: 'saldo', color: 'var(--color-blue)', name: 'Saldo Projetado' },
            ]}
            xAxisKey="dia"
          />
        </Card>

        <Card header="Saldo por Banco">
          <BarChart
            data={saldoPorBanco}
            dataKey="valor"
            nameKey="banco"
            color="var(--color-green)"
            horizontal
          />
        </Card>

        <Card header="Indicador de Liquidez">
          <GaugeChart value={67} label="Liquidez 1.34" />
        </Card>

        <Card header="Composição das Entradas">
          <PieChart data={composicaoEntradas} />
        </Card>
      </div>
    </motion.div>
  );
}
