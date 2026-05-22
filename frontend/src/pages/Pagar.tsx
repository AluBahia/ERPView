import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { FilterBar } from '../components/filters/FilterBar';
import { useExport } from '../hooks/useExport';
import { useKPIs } from '../hooks/useKPIs';
import { usePagar } from '../hooks/usePagar';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { statusToBadgeVariant } from '../lib/formatters';
import { pagarKPIs } from '../lib/mock-data/kpis';
import type { TituloPagar } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const agingPagamentos = [
  { faixa: '0-30d', valor: 380000 },
  { faixa: '31-60d', valor: 260000 },
  { faixa: '61-90d', valor: 145000 },
  { faixa: '91-120d', valor: 72000 },
  { faixa: '>120d', valor: 15200 },
];

const porCategoria = [
  { categoria: 'Materiais', valor: 28400 },
  { categoria: 'Insumos', valor: 15200 },
  { categoria: 'Utilidades', valor: 42000 },
  { categoria: 'Serviços', valor: 18700 },
  { categoria: 'Logística', valor: 9800 },
];

const projecaoSaidas = [
  { semana: 'Sem 1', previsto: 78000, realizado: 72000 },
  { semana: 'Sem 2', previsto: 95000, realizado: 91000 },
  { semana: 'Sem 3', previsto: 68000, realizado: 70500 },
  { semana: 'Sem 4', previsto: 112000, realizado: 98500 },
];

/* -------------------------------------------------------------------------- */
/*  Kanban helpers                                                            */
/* -------------------------------------------------------------------------- */

const KANBAN_COLS: { key: TituloPagar['status']; label: string; color: string }[] = [
  { key: 'Pendente', label: 'Pendente', color: 'var(--color-amber)' },
  { key: 'Aprovado', label: 'Aprovado', color: 'var(--color-green)' },
  { key: 'Pago', label: 'Pago', color: 'var(--color-blue)' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Pagar() {
  const { data: kpis, isLoading: kpiLoading, error: kpiError, refetch: refetchKPIs } = useKPIs('pagar');
  const { data: titulos, isLoading: dataLoading, error: dataError, refetch: refetchData } = usePagar();
  const { exporting, exportReport } = useExport();

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;
  const refetch = () => { refetchKPIs(); refetchData(); };

  if (isLoading) return <LoadingSkeleton kpiCount={6} chartCount={4} tableRows={3} />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;

  const displayKPIs = kpis || pagarKPIs;

  const grouped = useMemo(() => {
    const map: Record<string, any[]> = {
      Pendente: [],
      Aprovado: [],
      Pago: [],
    };
    (titulos || []).forEach((t: any) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [titulos]);

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
            Contas a Pagar
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Gerencie pagamentos, aprovações e prazo médio de pagamento
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('pagar')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {displayKPIs.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card header="Aging de Pagamentos">
          <BarChart
            data={agingPagamentos}
            dataKey="valor"
            nameKey="faixa"
            color="var(--color-amber)"
          />
        </Card>

        <Card header="Pagamentos por Categoria">
          <BarChart
            data={porCategoria}
            dataKey="valor"
            nameKey="categoria"
            color="var(--color-blue)"
            horizontal
          />
        </Card>

        <Card header="Projeção de Saídas">
          <LineChart
            data={projecaoSaidas}
            dataKeys={[
              { key: 'previsto', color: 'var(--color-amber)', name: 'Previsto' },
              { key: 'realizado', color: 'var(--color-green)', name: 'Realizado' },
            ]}
            xAxisKey="semana"
          />
        </Card>

        <Card header="Prazo Médio de Pagamento">
          <GaugeChart value={32} label="PMP 32 dias" />
        </Card>
      </div>

      {/* Kanban — Aprovações */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Quadro de Aprovações
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {KANBAN_COLS.map((col) => (
            <div key={col.key} className="flex flex-col gap-3">
              {/* Column header */}
              <div className="flex items-center gap-2 px-1">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <span className="text-sm font-medium text-text-primary">
                  {col.label}
                </span>
                <span className="text-xs text-text-muted ml-auto">
                  {grouped[col.key].length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {grouped[col.key].length === 0 && (
                  <div className="rounded-lg border border-dashed border-border-subtle p-4 text-center text-sm text-text-muted">
                    Nenhum título
                  </div>
                )}
                {grouped[col.key].map((t) => (
                  <div
                    key={t.id}
                    className="bg-bg-secondary border border-border rounded-lg p-3 flex flex-col gap-1.5 hover:border-border-subtle transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">
                        {t.numero}
                      </span>
                      <Badge variant={statusToBadgeVariant(t.status)}>
                        {t.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-text-muted">{t.fornecedor}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-semibold text-text-primary">
                        {t.valor}
                      </span>
                      <span className="text-xs text-text-muted">
                        Venc: {t.vencimento}
                      </span>
                    </div>
                    <span className="text-[11px] text-text-muted">
                      {t.categoria}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
