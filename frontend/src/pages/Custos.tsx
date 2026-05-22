import { useState, useMemo } from 'react';
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
import { useKPIs } from '../hooks/useKPIs';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { custosKPIs } from '../lib/mock-data/kpis';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const padraoVsReal = [
  { produto: 'Flange DN100', padrao: 45, real: 47.3 },
  { produto: 'Válvula 2"', padrao: 120, real: 118.5 },
  { produto: 'Vedação K3', padrao: 8.5, real: 9.1 },
  { produto: 'Tubo 4"', padrao: 92, real: 96.2 },
  { produto: 'Conjunto MX', padrao: 34, real: 35.8 },
];

const composicaoCusto = [
  { name: 'Matéria-prima', value: 52, fill: 'var(--color-blue)' },
  { name: 'Mão de obra', value: 24, fill: 'var(--color-green)' },
  { name: 'CIF', value: 14, fill: 'var(--color-amber)' },
  { name: 'Despesas Indiretas', value: 10, fill: 'var(--color-red)' },
];

const evolucaoCusto = [
  { mes: 'Jan', custo: 44.2 },
  { mes: 'Fev', custo: 44.8 },
  { mes: 'Mar', custo: 45.5 },
  { mes: 'Abr', custo: 46.1 },
  { mes: 'Mai', custo: 47.3 },
];

/* -------------------------------------------------------------------------- */
/*  Simulator                                                                 */
/* -------------------------------------------------------------------------- */

function Simulator() {
  const [custo, setCusto] = useState(47.3);
  const [markup, setMarkup] = useState(45);

  const result = useMemo(() => {
    const preco = custo * (1 + markup / 100);
    const margem = ((preco - custo) / preco) * 100;
    return {
      preco: preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      margem: margem.toFixed(1),
    };
  }, [custo, markup]);

  return (
    <Card header="Simulador de Preço e Margem">
      <div className="flex flex-col gap-4">
        {/* Custo input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Custo Unitário (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={custo}
            onChange={(e) => setCusto(Number(e.target.value))}
            className="bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50 w-full"
          />
        </div>

        {/* Markup input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Markup (%)
          </label>
          <input
            type="number"
            step="0.5"
            value={markup}
            onChange={(e) => setMarkup(Number(e.target.value))}
            className="bg-bg-tertiary border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-blue/50 w-full"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-border my-1" />

        {/* Outputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted">Preço de Venda</span>
            <span className="text-xl font-bold text-green">{result.preco}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted">Margem (%)</span>
            <span className="text-xl font-bold text-blue">{result.margem}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Custos() {
  const { data: kpis, isLoading, error, refetch } = useKPIs('custos');
  const { exporting, exportReport } = useExport();

  if (isLoading) return <LoadingSkeleton kpiCount={4} chartCount={4} tableRows={0} />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const displayKPIs = kpis || custosKPIs;

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
            Custos &amp; Margens
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Análise de custo padrão vs real, composição e simulador de preço
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('custos')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {displayKPIs.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card header="Custo Padrão vs Real">
          <BarChart
            data={padraoVsReal}
            dataKey="real"
            nameKey="produto"
            color="var(--color-amber)"
            horizontal
          />
        </Card>

        <Card header="Composição do Custo">
          <PieChart data={composicaoCusto} />
        </Card>

        <Card header="Evolução do Custo Médio (R$)">
          <LineChart
            data={evolucaoCusto}
            dataKeys={[
              { key: 'custo', color: 'var(--color-amber)', name: 'Custo Médio' },
            ]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Desvio Padrão vs Real">
          <GaugeChart value={3.4} label="Desvio 3.4%" />
        </Card>
      </div>

      {/* Simulator */}
      <Simulator />
    </motion.div>
  );
}
