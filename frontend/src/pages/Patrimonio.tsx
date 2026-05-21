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
import { statusToBadgeVariant } from '../lib/formatters';
import { patrimonioKPIs, mockBens } from '../lib/mock-data/kpis';
import type { BemPatrimonial } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const valorPorCategoria = [
  { categoria: 'Máquinas', valor: 830000 },
  { categoria: 'Veículos', valor: 240000 },
  { categoria: 'Instalações', valor: 280000 },
  { categoria: 'Móveis/Equip.', valor: 95000 },
  { categoria: 'TI', valor: 180000 },
];

const depreciacaoMensal = [
  { mes: 'Jan', depreciacao: 72000 },
  { mes: 'Fev', depreciacao: 74000 },
  { mes: 'Mar', depreciacao: 75000 },
  { mes: 'Abr', depreciacao: 76000 },
  { mes: 'Mai', depreciacao: 78000 },
];

const composicaoPatrimonio = [
  { name: 'Máquinas', value: 50, fill: 'var(--color-blue)' },
  { name: 'Veículos', value: 14, fill: 'var(--color-green)' },
  { name: 'Instalações', value: 17, fill: 'var(--color-amber)' },
  { name: 'Móveis/Equip.', value: 6, fill: 'var(--color-red)' },
  { name: 'TI', value: 11, fill: '#8b5cf6' },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const columns = [
  { key: 'codigo' as const, label: 'Código' },
  { key: 'descricao' as const, label: 'Descrição' },
  { key: 'categoria' as const, label: 'Categoria' },
  { key: 'valorOriginal' as const, label: 'Valor Original' },
  { key: 'depreciacaoAcumulada' as const, label: 'Depreciação Acum.' },
  { key: 'valorLiquido' as const, label: 'Valor Líquido' },
  { key: 'localizacao' as const, label: 'Localização' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: BemPatrimonial['status']) => (
      <Badge variant={statusToBadgeVariant(value)}>{value}</Badge>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Patrimonio() {
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
            Ativo Fixo &amp; Patrimônio
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Controle de bens, depreciação e valor líquido do imobilizado
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar />
          <Button
            variant="ghost"
            size="sm"
            loading={exporting}
            onClick={() => exportReport('patrimonio')}
          >
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {patrimonioKPIs.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card header="Valor por Categoria">
          <BarChart
            data={valorPorCategoria}
            dataKey="valor"
            nameKey="categoria"
            color="var(--color-blue)"
            horizontal
          />
        </Card>

        <Card header="Depreciação Mensal">
          <LineChart
            data={depreciacaoMensal}
            dataKeys={[
              { key: 'depreciacao', color: 'var(--color-amber)', name: 'Depreciação' },
            ]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Composição do Imobilizado">
          <PieChart data={composicaoPatrimonio} />
        </Card>

        <Card header="Bens em Uso">
          <GaugeChart value={78} label="78% em uso" />
        </Card>
      </div>

      {/* DataTable */}
      <Card header="Bens Patrimoniais">
        <DataTable columns={columns} data={mockBens} />
      </Card>
    </motion.div>
  );
}
