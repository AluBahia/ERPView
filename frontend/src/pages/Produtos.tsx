import { useState } from 'react';
import { motion } from 'framer-motion';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { useKPIs } from '../hooks/useKPIs';
import { useExport } from '../hooks/useExport';
import { useProdutos } from '../hooks/useProdutos';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import type { Produto } from '../types';

/* -------------------------------------------------------------------------- */
/*  Chart data                                                                */
/* -------------------------------------------------------------------------- */

const margemPorFamilia = [
  { familia: 'Flanges', margem: 33.8 },
  { familia: 'Válvulas', margem: 35.1 },
  { familia: 'Vedações', margem: 39.3 },
  { familia: 'Tubos', margem: 17.9 },
];

const faturamentoPorFamilia = [
  { name: 'Flanges', value: 38, fill: '#3b82f6' },
  { name: 'Válvulas', value: 28, fill: '#10b981' },
  { name: 'Vedações', value: 20, fill: '#f59e0b' },
  { name: 'Tubos', value: 14, fill: '#ef4444' },
];

const custoUnitario = [
  { mes: 'Jan', custo: 42.5 }, { mes: 'Fev', custo: 43.8 },
  { mes: 'Mar', custo: 44.1 }, { mes: 'Abr', custo: 45.9 },
  { mes: 'Mai', custo: 47.3 },
];

/* -------------------------------------------------------------------------- */
/*  BOM tree mock data                                                        */
/* -------------------------------------------------------------------------- */

interface BOMNode {
  codigo: string;
  descricao: string;
  qtd: string;
  unidade: string;
  children?: BOMNode[];
}

const bomTree: Record<string, BOMNode> = {
  'PRD-001': {
    codigo: 'PRD-001',
    descricao: 'Flange DN100',
    qtd: '1',
    unidade: 'un',
    children: [
      { codigo: 'MP-0012', descricao: 'Chapa Aço 3mm', qtd: '2,4', unidade: 'kg' },
      { codigo: 'MP-0078', descricao: 'Tinta Industrial Azul', qtd: '0,3', unidade: 'L' },
      { codigo: 'CP-0021', descricao: 'Parafuso M8x30', qtd: '8', unidade: 'un' },
    ],
  },
  'PRD-002': {
    codigo: 'PRD-002',
    descricao: 'Válvula Gaveta 2"',
    qtd: '1',
    unidade: 'un',
    children: [
      { codigo: 'MP-0034', descricao: 'Barra Latão 12mm', qtd: '1,8', unidade: 'kg' },
      { codigo: 'CP-0045', descricao: 'Corpo Válvula', qtd: '1', unidade: 'un' },
      { codigo: 'CP-0046', descricao: 'Haste Acionamento', qtd: '1', unidade: 'un' },
    ],
  },
  'PRD-003': {
    codigo: 'PRD-003',
    descricao: 'Conjunto Vedação K3',
    qtd: '1',
    unidade: 'un',
    children: [
      { codigo: 'MP-0091', descricao: 'Resina Epóxi', qtd: '0,15', unidade: 'kg' },
      { codigo: 'CP-0060', descricao: 'O-Ring NBR70', qtd: '2', unidade: 'un' },
    ],
  },
  'PRD-004': {
    codigo: 'PRD-004',
    descricao: 'Tubo Aço Carbono 4"',
    qtd: '1',
    unidade: 'un',
    children: [
      { codigo: 'MP-0012', descricao: 'Chapa Aço 3mm', qtd: '8,2', unidade: 'kg' },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  Table columns                                                             */
/* -------------------------------------------------------------------------- */

const giroVariant = (giro: Produto['giro']) => {
  const map: Record<Produto['giro'], 'green' | 'amber' | 'red'> = {
    Alto: 'green',
    Médio: 'amber',
    Baixo: 'red',
  };
  return map[giro];
};

interface ProdutoRow extends Produto {
  [key: string]: unknown;
}

export default function Produtos() {
  const { data: kpis, isLoading: kpiLoading, error: kpiError, refetch: refetchKPIs } = useKPIs('produtos');
  const { data: produtos, isLoading: dataLoading, error: dataError, refetch: refetchData } = useProdutos();
  const { exporting, exportReport } = useExport();
  const [bomOpen, setBomOpen] = useState(false);
  const [selectedBom, setSelectedBom] = useState<BOMNode | null>(null);

  const isLoading = kpiLoading || dataLoading;
  const error = kpiError || dataError;
  const refetch = () => { refetchKPIs(); refetchData(); };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!produtos?.length) return <EmptyState title="Nenhum produto encontrado" subtitle="Não há produtos cadastrados no sistema." />;

  const displayKPIs = kpis || [];

  const handleBomClick = (codigo: string) => {
    const tree = bomTree[codigo];
    if (tree) {
      setSelectedBom(tree);
      setBomOpen(true);
    }
  };

  const columns = [
    { key: 'codigo' as const, label: 'Código' },
    { key: 'descricao' as const, label: 'Descrição' },
    { key: 'familia' as const, label: 'Família' },
    { key: 'custo' as const, label: 'Custo' },
    { key: 'precoVenda' as const, label: 'Preço' },
    { key: 'margem' as const, label: 'Margem' },
    {
      key: 'giro' as const,
      label: 'Giro',
      render: (value: Produto['giro']) => (
        <Badge variant={giroVariant(value)}>{value}</Badge>
      ),
    },
    {
      key: 'id' as const,
      label: 'Ações',
      render: (_value: unknown, row: ProdutoRow) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleBomClick(row.codigo as string)}
        >
          BOM
        </Button>
      ),
    },
  ];

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
          <h1 className="text-2xl font-bold text-text-primary">Produtos</h1>
          <p className="text-sm text-text-muted mt-1">
            Catálogo, composição e análise de rentabilidade
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          loading={exporting}
          onClick={() => exportReport('produtos')}
        >
          Exportar
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        <Card header="Margem por Família">
          <BarChart
            data={margemPorFamilia}
            dataKey="margem"
            nameKey="familia"
            color="#10b981"
          />
        </Card>

        <Card header="Faturamento por Família">
          <PieChart data={faturamentoPorFamilia} />
        </Card>

        <Card header="Custo Unitário (média)">
          <LineChart
            data={custoUnitario}
            dataKeys={[{ key: 'custo', color: '#f59e0b', name: 'Custo (R$)' }]}
            xAxisKey="mes"
          />
        </Card>

        <Card header="Fichas Completas">
          <div className="flex items-center justify-center py-4">
            <GaugeChart value={72} label="Fichas Completas" size={200} />
          </div>
        </Card>
      </div>

      {/* Data Section */}
      <Card header="Catálogo de Produtos">
        <DataTable columns={columns} data={produtos as unknown as ProdutoRow[]} />
      </Card>

      {/* BOM Modal */}
      <Modal
        open={bomOpen}
        onClose={() => setBomOpen(false)}
        title={`BOM — ${selectedBom?.codigo ?? ''}`}
      >
        {selectedBom && (
          <div className="flex flex-col gap-3">
            {/* Parent node */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-tertiary border border-border">
              <span className="text-blue font-bold text-sm">{selectedBom.codigo}</span>
              <span className="text-sm text-text-primary">{selectedBom.descricao}</span>
              <span className="ml-auto text-xs text-text-muted">
                {selectedBom.qtd} {selectedBom.unidade}
              </span>
            </div>

            {/* Children */}
            {selectedBom.children && selectedBom.children.length > 0 && (
              <div className="ml-6 border-l-2 border-border-subtle pl-4 flex flex-col gap-2">
                {selectedBom.children.map((child) => (
                  <div
                    key={child.codigo}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-green" />
                    <span className="text-sm font-medium text-text-secondary">
                      {child.codigo}
                    </span>
                    <span className="text-sm text-text-primary">{child.descricao}</span>
                    <span className="ml-auto text-xs text-text-muted">
                      {child.qtd} {child.unidade}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
