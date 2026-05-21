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
import { expedicaoKPIs, mockExpedicao } from '../lib/mock-data/kpis';
import type { PedidoExpedicao } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const otdPorTransportadora = [
  { transportadora: 'Jadlog', otd: 88 },
  { transportadora: 'Próprio', otd: 95 },
  { transportadora: 'Rodoviária SP', otd: 82 },
  { transportadora: 'Total Express', otd: 79 },
  { transportadora: 'Jamef', otd: 91 },
];

const volumeExpedido = [
  { semana: 'Sem 14', volume: 12400 },
  { semana: 'Sem 15', volume: 14200 },
  { semana: 'Sem 16', volume: 13800 },
  { semana: 'Sem 17', volume: 15600 },
  { semana: 'Sem 18', volume: 14800 },
];

const modais = [
  { name: 'Rodoviário', value: 62, fill: '#3b82f6' },
  { name: 'Próprio', value: 24, fill: '#10b981' },
  { name: 'Aéreo', value: 8, fill: '#f59e0b' },
  { name: 'Ferroviário', value: 6, fill: '#ef4444' },
];

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const statusVariant = (status: PedidoExpedicao['status']) => {
  const map: Record<PedidoExpedicao['status'], 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
    'Em separação': 'blue',
    Pronto: 'green',
    'Em trânsito': 'amber',
    Entregue: 'gray',
    Atrasado: 'red',
  };
  return map[status];
};

const columns = [
  { key: 'numero' as const, label: 'Pedido' },
  { key: 'cliente' as const, label: 'Cliente' },
  { key: 'cidade' as const, label: 'Cidade' },
  { key: 'peso' as const, label: 'Peso' },
  { key: 'transportadora' as const, label: 'Transportadora' },
  { key: 'prevEntrega' as const, label: 'Previsão' },
  {
    key: 'status' as const,
    label: 'Status',
    render: (value: PedidoExpedicao['status']) => (
      <Badge variant={statusVariant(value)}>{value}</Badge>
    ),
  },
];

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Expedicao() {
  const { data: kpis } = useKPIs('expedicao');
  const { exporting, exportReport } = useExport();

  const displayKPIs = kpis ?? expedicaoKPIs;

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
          <h1 className="text-2xl font-bold text-text-primary">Expedição</h1>
          <p className="text-sm text-text-muted mt-1">
            Acompanhamento de embarques, OTD e logística
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          loading={exporting}
          onClick={() => exportReport('expedicao')}
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
        <Card header="OTD por Transportadora (%)">
          <BarChart
            data={otdPorTransportadora}
            dataKey="otd"
            nameKey="transportadora"
            color="#3b82f6"
          />
        </Card>

        <Card header="Volume Expedido (kg)">
          <LineChart
            data={volumeExpedido}
            dataKeys={[{ key: 'volume', color: '#10b981', name: 'Volume (kg)' }]}
            xAxisKey="semana"
          />
        </Card>

        <Card header="Modais de Transporte">
          <PieChart data={modais} />
        </Card>

        <Card header="On-Time Delivery">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={87.4} label="OTD" size={200} />
          </div>
        </Card>
      </div>

      {/* Data Section */}
      <Card header="Pedidos de Expedição">
        <DataTable columns={columns} data={mockExpedicao} />
      </Card>
    </motion.div>
  );
}
