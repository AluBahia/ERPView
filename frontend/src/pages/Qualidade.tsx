import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { useKPIs } from '../hooks/useKPIs';
import { useExport } from '../hooks/useExport';
import { qualidadeKPIs, mockNCRs } from '../lib/mock-data/kpis';
import type { NCR } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const paretoDefeitos = [
  { defeito: 'Dim. fora tol.', ocorrencias: 28 },
  { defeito: 'Acabamento', ocorrencias: 19 },
  { defeito: 'Montagem', ocorrencias: 14 },
  { defeito: 'Material NC', ocorrencias: 10 },
  { defeito: 'Riscos', ocorrencias: 7 },
  { defeito: 'Outros', ocorrencias: 5 },
];

const dpmoMensal = [
  { mes: 'Dez', dpmo: 420 }, { mes: 'Jan', dpmo: 390 },
  { mes: 'Fev', dpmo: 365 }, { mes: 'Mar', dpmo: 340 },
  { mes: 'Abr', dpmo: 330 }, { mes: 'Mai', dpmo: 320 },
];

const ncrsPorArea = [
  { area: 'Usinagem', ncrs: 14 },
  { area: 'Montagem', ncrs: 9 },
  { area: 'Pintura', ncrs: 6 },
  { area: 'Soldagem', ncrs: 4 },
  { area: 'Expedição', ncrs: 2 },
];

/* -------------------------------------------------------------------------- */
/*  Kanban columns                                                            */
/* -------------------------------------------------------------------------- */

type NCRStatus = NCR['status'];

const kanbanColumns: { status: NCRStatus; label: string; color: string }[] = [
  { status: 'Aberta', label: 'Aberta', color: '#3b82f6' },
  { status: 'Em análise', label: 'Em análise', color: '#f59e0b' },
  { status: 'Ação corretiva', label: 'Ação corretiva', color: '#ef4444' },
  { status: 'Verificação', label: 'Verificação', color: '#10b981' },
  { status: 'Fechada', label: 'Fechada', color: '#6b7280' },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Qualidade() {
  const { data: kpis } = useKPIs('qualidade');
  const { exporting, exportReport } = useExport();

  const displayKPIs = kpis ?? qualidadeKPIs;

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
          <h1 className="text-2xl font-bold text-text-primary">Qualidade</h1>
          <p className="text-sm text-text-muted mt-1">
            Não conformidades, indicadores e gestão de qualidade
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          loading={exporting}
          onClick={() => exportReport('qualidade')}
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
        <Card header="Pareto de Defeitos">
          <BarChart
            data={paretoDefeitos}
            dataKey="ocorrencias"
            nameKey="defeito"
            color="#ef4444"
          />
        </Card>

        <Card header="DPMO Mensal">
          <LineChart
            data={dpmoMensal}
            dataKeys={[{ key: 'dpmo', color: '#3b82f6', name: 'DPMO' }]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="NCRs por Área">
          <BarChart
            data={ncrsPorArea}
            dataKey="ncrs"
            nameKey="area"
            color="#f59e0b"
          />
        </Card>

        <Card header="First Pass Yield (FPY)">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={96.2} label="FPY" size={200} />
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      <Card header="Kanban — Não Conformidades">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {kanbanColumns.map((col) => {
            const items = mockNCRs.filter((ncr) => ncr.status === col.status);
            return (
              <div
                key={col.status}
                className="flex flex-col gap-2 bg-bg-tertiary rounded-lg p-3 min-h-[200px]"
              >
                {/* Column header */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: col.color }}
                  />
                  <span className="text-xs font-semibold text-text-primary">
                    {col.label}
                  </span>
                  <span className="ml-auto text-[10px] text-text-muted bg-bg-secondary rounded-full px-2 py-0.5">
                    {items.length}
                  </span>
                </div>

                {/* Cards */}
                {items.map((ncr) => (
                  <div
                    key={ncr.id}
                    className="bg-bg-secondary border border-border rounded-lg p-3 flex flex-col gap-1.5 hover:border-border-subtle transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-primary">
                        {ncr.numero}
                      </span>
                      {ncr.vencida && (
                        <Badge variant="red">Vencida</Badge>
                      )}
                    </div>
                    <span className="text-xs text-text-secondary">{ncr.descricao}</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-text-muted">
                        {ncr.produto}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        Prazo: {ncr.prazo}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted">
                      Resp.: {ncr.responsavel}
                    </span>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="flex items-center justify-center flex-1">
                    <span className="text-xs text-text-muted italic">
                      Nenhum item
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}
