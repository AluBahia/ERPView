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
import { estoqueKPIs, mockEstoque } from '../lib/mock-data/kpis';
import type { ItemEstoque } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const saldoPorDeposito = [
  { deposito: 'Galpão A', saldo: 1840000 },
  { deposito: 'Galpão B', saldo: 960000 },
  { deposito: 'Almoxarifado', saldo: 1120000 },
  { deposito: 'Externo', saldo: 310000 },
];

const giroMensal = [
  { mes: 'Jan', giro: 3.8 }, { mes: 'Fev', giro: 4.0 },
  { mes: 'Mar', giro: 3.9 }, { mes: 'Abr', giro: 4.1 },
  { mes: 'Mai', giro: 4.2 },
];

const valorPorCategoria = [
  { name: 'Matéria-prima', value: 52, fill: '#3b82f6' },
  { name: 'Componentes', value: 24, fill: '#10b981' },
  { name: 'Insumos', value: 14, fill: '#f59e0b' },
  { name: 'Embalagens', value: 10, fill: '#ef4444' },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const statusVariant = (status: ItemEstoque['status']) => {
  const map: Record<ItemEstoque['status'], 'green' | 'amber' | 'red' | 'gray'> = {
    OK: 'green',
    Atenção: 'amber',
    Crítico: 'red',
    Zerado: 'gray',
  };
  return map[status];
};

const columns = [
  { key: 'codigo' as const, label: 'Código' },
  { key: 'descricao' as const, label: 'Descrição' },
  { key: 'deposito' as const, label: 'Depósito' },
  { key: 'saldo' as const, label: 'Saldo' },
  { key: 'minimo' as const, label: 'Mínimo' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: ItemEstoque['status']) => (
      <Badge variant={statusVariant(value)}>{value}</Badge>
    ),
  },
  { key: 'cobertura' as const, label: 'Cobertura' },
];

/* -------------------------------------------------------------------------- */
/*  Critical items                                                            */
/* -------------------------------------------------------------------------- */

const criticalItems = mockEstoque.filter(
  (item) => item.status === 'Zerado' || item.status === 'Crítico',
);

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Estoque() {
  const { data: kpis } = useKPIs('estoque');
  const { exporting, exportReport } = useExport();

  const displayKPIs = kpis ?? estoqueKPIs;

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
          <h1 className="text-2xl font-bold text-text-primary">Estoque</h1>
          <p className="text-sm text-text-muted mt-1">
            Gestão de saldos, cobertura e alertas de estoque
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          loading={exporting}
          onClick={() => exportReport('estoque')}
        >
          Exportar
        </Button>
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
        <Card header="Saldo por Depósito">
          <BarChart
            data={saldoPorDeposito}
            dataKey="saldo"
            nameKey="deposito"
            color="#3b82f6"
          />
        </Card>

        <Card header="Cobertura Média">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={68} label="Cobertura Média" size={200} />
          </div>
        </Card>

        <Card header="Giro Mensal">
          <LineChart
            data={giroMensal}
            dataKeys={[{ key: 'giro', color: '#10b981', name: 'Giro' }]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Valor por Categoria">
          <PieChart data={valorPorCategoria} />
        </Card>
      </div>

      {/* Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main table */}
        <div className="lg:col-span-2">
          <Card header="Itens em Estoque">
            <DataTable columns={columns} data={mockEstoque} />
          </Card>
        </div>

        {/* Alert panel */}
        <Card header="Alertas Críticos">
          <div className="flex flex-col gap-3">
            {criticalItems.length === 0 && (
              <p className="text-sm text-text-muted">Nenhum item crítico.</p>
            )}
            {criticalItems.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-tertiary border border-border"
              >
                <Badge variant={item.status === 'Zerado' ? 'gray' : 'red'}>
                  {item.status}
                </Badge>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text-primary">
                    {item.codigo} — {item.descricao}
                  </span>
                  <span className="text-xs text-text-muted">
                    Depósito: {item.deposito} | Saldo: {item.saldo} | Cobertura: {item.cobertura}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
