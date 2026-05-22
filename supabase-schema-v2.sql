-- ==========================================
-- Script de Schema Supabase v2 — Tabelas Faltantes
-- Execute no SQL Editor do Supabase
-- ==========================================

-- Tabela de Perfis de Usuário (vinculada ao auth.users)
CREATE TABLE IF NOT EXISTS perfis_usuario (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  nome TEXT NOT NULL,
  cargo TEXT,
  role TEXT DEFAULT 'visualizador' CHECK (role IN ('admin', 'gerente', 'operador', 'visualizador', 'financeiro')),
  modulos_permitidos TEXT[] DEFAULT '{}', -- ex: {'vendas', 'compras', 'financeiro'}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS log_auditoria (
  id BIGSERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  acao TEXT NOT NULL, -- ex: INSERT, UPDATE, DELETE
  tabela TEXT NOT NULL,
  registro_id TEXT,
  dados JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Cache/Snapshot de KPIs do Dashboard
CREATE TABLE IF NOT EXISTS dashboard_kpis (
  id BIGSERIAL PRIMARY KEY,
  data DATE UNIQUE DEFAULT CURRENT_DATE,
  vendas_dia DECIMAL(19,4) DEFAULT 0,
  vendas_mes DECIMAL(19,4) DEFAULT 0,
  contas_receber_vencidas DECIMAL(19,4) DEFAULT 0,
  contas_pagar_vencer DECIMAL(19,4) DEFAULT 0,
  ncr_abertas INT DEFAULT 0,
  os_manutencao_pendentes INT DEFAULT 0,
  giro_estoque DECIMAL(10,2) DEFAULT 0,
  producao_dia DECIMAL(19,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Fluxo de Caixa (sincronizada pelo Sync Agent)
CREATE TABLE IF NOT EXISTS fluxo_caixa (
  id BIGSERIAL PRIMARY KEY,
  data DATE NOT NULL,
  tipo TEXT CHECK (tipo IN ('Entrada', 'Saída')),
  categoria TEXT NOT NULL,
  descricao TEXT,
  valor DECIMAL(19,4) DEFAULT 0,
  saldo_acumulado DECIMAL(19,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de DRE (Demonstrativo do Resultado do Exercício)
CREATE TABLE IF NOT EXISTS dre (
  id BIGSERIAL PRIMARY KEY,
  periodo TEXT NOT NULL UNIQUE, -- Formato 'YYYY-MM'
  receita_bruta DECIMAL(19,4) DEFAULT 0,
  deducoes DECIMAL(19,4) DEFAULT 0,
  receita_liquida DECIMAL(19,4) DEFAULT 0,
  custo_produtos DECIMAL(19,4) DEFAULT 0,
  lucro_bruto DECIMAL(19,4) DEFAULT 0,
  despesas_operacionais DECIMAL(19,4) DEFAULT 0,
  resultado_liquido DECIMAL(19,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Custos de Produção por Produto
CREATE TABLE IF NOT EXISTS custos (
  id BIGSERIAL PRIMARY KEY,
  periodo TEXT NOT NULL, -- Formato 'YYYY-MM'
  produto_id BIGINT REFERENCES produtos(id) ON DELETE CASCADE,
  custo_materia_prima DECIMAL(19,4) DEFAULT 0,
  custo_mao_obra DECIMAL(19,4) DEFAULT 0,
  custo_indireto DECIMAL(19,4) DEFAULT 0,
  custo_total DECIMAL(19,4) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (periodo, produto_id)
);

-- Tabela de Colaboradores (RH)
CREATE TABLE IF NOT EXISTS rh_colaboradores (
  id BIGSERIAL PRIMARY KEY,
  matricula TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  salario DECIMAL(19,4) DEFAULT 0,
  data_admissao DATE NOT NULL,
  status TEXT CHECK (status IN ('Ativo', 'Férias', 'Afastado', 'Desligado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de Pedidos de Compra (sincronizada pelo Sync Agent)
CREATE TABLE IF NOT EXISTS pedidos_compra (
  id BIGSERIAL PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  fornecedor_id BIGINT REFERENCES fornecedores(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('Rascunho', 'Enviado', 'Confirmado', 'Recebido', 'Cancelado')),
  data_emissao DATE,
  data_previsao DATE,
  data_recebimento DATE,
  valor_total DECIMAL(19,4) DEFAULT 0,
  observacao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================
ALTER TABLE perfis_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_auditoria ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE fluxo_caixa ENABLE ROW LEVEL SECURITY;
ALTER TABLE dre ENABLE ROW LEVEL SECURITY;
ALTER TABLE custos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rh_colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_compra ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura: qualquer usuário autenticado pode ler
CREATE POLICY "Usuários autenticados podem ler perfis" ON perfis_usuario FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem ler log_auditoria" ON log_auditoria FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem ler dashboard_kpis" ON dashboard_kpis FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem ler fluxo_caixa" ON fluxo_caixa FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem ler dre" ON dre FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem ler custos" ON custos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Usuários autenticados podem ler rh_colaboradores" ON rh_colaboradores FOR SELECT TO authenticated USING (true);

-- ==========================================
-- Índices para performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_perfis_usuario_user ON perfis_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_log_auditoria_usuario ON log_auditoria(usuario_id);
CREATE INDEX IF NOT EXISTS idx_fluxo_caixa_data ON fluxo_caixa(data);
CREATE INDEX IF NOT EXISTS idx_dre_periodo ON dre(periodo);
CREATE INDEX IF NOT EXISTS idx_custos_periodo_produto ON custos(periodo, produto_id);
CREATE INDEX IF NOT EXISTS idx_rh_colaboradores_status ON rh_colaboradores(status);
