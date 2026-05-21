-- ==========================================
-- Script de criação das tabelas no Supabase
-- Execute no SQL Editor do Supabase
-- ==========================================

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  segmento TEXT,
  volume_compras DECIMAL(19,4) DEFAULT 0,
  frequencia TEXT,
  prazo_medio TEXT,
  classe_abc TEXT CHECK (classe_abc IN ('A', 'B', 'C')),
  status_credito TEXT CHECK (status_credito IN ('OK', 'Atenção', 'Bloqueado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT NOT NULL,
  familia TEXT,
  custo DECIMAL(19,4) DEFAULT 0,
  preco_venda DECIMAL(19,4) DEFAULT 0,
  margem DECIMAL(10,2),
  giro TEXT CHECK (giro IN ('Alto', 'Médio', 'Baixo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Pedidos de Venda
CREATE TABLE IF NOT EXISTS pedidos_venda (
  id BIGSERIAL PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,
  cliente_id BIGINT REFERENCES clientes(id),
  vendedor TEXT,
  data_pedido DATE,
  valor_total DECIMAL(19,4) DEFAULT 0,
  status TEXT CHECK (status IN ('Aberto', 'Em produção', 'Expedido', 'Faturado', 'Cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Itens em Estoque
CREATE TABLE IF NOT EXISTS itens_estoque (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  deposito TEXT,
  saldo DECIMAL(19,4) DEFAULT 0,
  minimo DECIMAL(19,4) DEFAULT 0,
  status TEXT CHECK (status IN ('OK', 'Atenção', 'Crítico', 'Zerado')),
  cobertura TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Títulos a Receber
CREATE TABLE IF NOT EXISTS titulos_receber (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT REFERENCES clientes(id),
  numero TEXT NOT NULL,
  emissao DATE,
  vencimento DATE,
  valor DECIMAL(19,4) DEFAULT 0,
  status TEXT CHECK (status IN ('A vencer', 'Vencido', 'Recebido')),
  dias_atraso INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Títulos a Pagar
CREATE TABLE IF NOT EXISTS titulos_pagar (
  id BIGSERIAL PRIMARY KEY,
  fornecedor TEXT NOT NULL,
  numero TEXT NOT NULL,
  emissao DATE,
  vencimento DATE,
  valor DECIMAL(19,4) DEFAULT 0,
  status TEXT CHECK (status IN ('Pendente', 'Aprovado', 'Pago', 'Vencido')),
  categoria TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT,
  avaliacao DECIMAL(3,2),
  homologacao TEXT CHECK (homologacao IN ('Homologado', 'Condicional', 'Não homologado')),
  documentacao TEXT CHECK (documentacao IN ('OK', 'Vencendo', 'Vencida')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Ordens de Produção
CREATE TABLE IF NOT EXISTS ordens_producao (
  id BIGSERIAL PRIMARY KEY,
  produto TEXT NOT NULL,
  quantidade DECIMAL(19,4) DEFAULT 0,
  inicio_prev DATE,
  fim_prev DATE,
  status TEXT CHECK (status IN ('Planejada', 'Em produção', 'Atrasada', 'Concluída')),
  desvio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Ordens de Serviço (Manutenção)
CREATE TABLE IF NOT EXISTS ordens_servico (
  id BIGSERIAL PRIMARY KEY,
  equipamento TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('Corretiva', 'Preventiva', 'Preditiva')),
  prioridade TEXT CHECK (prioridade IN ('Alta', 'Média', 'Baixa')),
  abertura DATE,
  prev_conclusao DATE,
  status TEXT CHECK (status IN ('Aberta', 'Em andamento', 'Vencida', 'Concluída')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Notas Fiscais
CREATE TABLE IF NOT EXISTS notas_fiscais (
  id BIGSERIAL PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,
  contraparte TEXT NOT NULL,
  data_emissao DATE,
  valor DECIMAL(19,4) DEFAULT 0,
  tipo TEXT CHECK (tipo IN ('Entrada', 'Saída')),
  status TEXT CHECK (status IN ('OK', 'Pendente', 'Erro')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Pedidos de Expedição
CREATE TABLE IF NOT EXISTS pedidos_expedicao (
  id BIGSERIAL PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,
  cliente TEXT NOT NULL,
  cidade TEXT,
  peso DECIMAL(10,2),
  transportadora TEXT,
  prev_entrega DATE,
  status TEXT CHECK (status IN ('Em separação', 'Pronto', 'Em trânsito', 'Entregue', 'Atrasado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de NCR (Não Conformidade)
CREATE TABLE IF NOT EXISTS ncr (
  id BIGSERIAL PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,
  produto TEXT,
  descricao TEXT,
  responsavel TEXT,
  prazo DATE,
  status TEXT CHECK (status IN ('Aberta', 'Em análise', 'Ação corretiva', 'Verificação', 'Fechada')),
  vencida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Bens Patrimoniais
CREATE TABLE IF NOT EXISTS bens_patrimoniais (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  descricao TEXT NOT NULL,
  categoria TEXT,
  valor_original DECIMAL(19,4) DEFAULT 0,
  depreciacao_acumulada DECIMAL(19,4) DEFAULT 0,
  valor_liquido DECIMAL(19,4) DEFAULT 0,
  localizacao TEXT,
  status TEXT CHECK (status IN ('Em uso', 'Depreciado', 'Baixado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================
-- Habilitar RLS em todas as tabelas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_venda ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE titulos_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE titulos_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_producao ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_expedicao ENABLE ROW LEVEL SECURITY;
ALTER TABLE ncr ENABLE ROW LEVEL SECURITY;
ALTER TABLE bens_patrimoniais ENABLE ROW LEVEL SECURITY;

-- Política de leitura: qualquer usuário autenticado pode ler
CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON clientes FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON produtos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON pedidos_venda FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON itens_estoque FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON titulos_receber FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON titulos_pagar FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON fornecedores FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON ordens_producao FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON ordens_servico FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON notas_fiscais FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON pedidos_expedicao FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON ncr FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários autenticados podem ler todas as tabelas"
ON bens_patrimoniais FOR SELECT TO authenticated USING (true);

-- ==========================================
-- Índices para performance
-- ==========================================
CREATE INDEX idx_clientes_classe_abc ON clientes(classe_abc);
CREATE INDEX idx_pedidos_venda_status ON pedidos_venda(status);
CREATE INDEX idx_pedidos_venda_data ON pedidos_venda(data_pedido);
CREATE INDEX idx_itens_estoque_status ON itens_estoque(status);
CREATE INDEX idx_titulos_receber_status ON titulos_receber(status);
CREATE INDEX idx_titulos_receber_vencimento ON titulos_receber(vencimento);
CREATE INDEX idx_titulos_pagar_status ON titulos_pagar(status);
CREATE INDEX idx_titulos_pagar_vencimento ON titulos_pagar(vencimento);
CREATE INDEX idx_ordens_producao_status ON ordens_producao(status);
CREATE INDEX idx_ordens_servico_status ON ordens_servico(status);
CREATE INDEX idx_notas_fiscais_status ON notas_fiscais(status);
CREATE INDEX idx_pedidos_expedicao_status ON pedidos_expedicao(status);
CREATE INDEX idx_ncr_status ON ncr(status);
CREATE INDEX idx_bens_patrimoniais_status ON bens_patrimoniais(status);
