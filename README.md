# ERPView — Dashboard de Visualização ERP

Dashboard web moderno para visualização de dados do ERP legado, com sincronização em tempo real via Supabase e suporte a Crystal Reports.

---

## Visão Geral

O ERPView é composto por três serviços que trabalham juntos:

```
Frontend (React PWA)  ←→  Supabase (PostgreSQL + Auth + Realtime)
                                    ↑
                           Sync Agent (Node.js — Windows Service)
                                    ↓
                         SQL Server 2008 R2 (ERP — somente leitura)

CR Service (Node.js local — porta 3001)
    ↑ chamado pelo frontend para gerar PDFs via Crystal Reports
```

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite 8 + TypeScript 5.9 + TailwindCSS v4 |
| Estado | TanStack Query v5 + Zustand 5 |
| Auth | Supabase Auth (email/senha) |
| Realtime | Supabase Realtime |
| Gráficos | Recharts 3 |
| PWA | vite-plugin-pwa + Workbox |
| Sync Agent | Node.js 18+ + mssql + node-windows |
| CR Service | Fastify + PowerShell bridge |
| Testes | Vitest + Testing Library + MSW |

---

## Requisitos

- **Node.js** 18 ou superior
- **npm** 9+
- **Conta Supabase** (projeto configurado)
- **SQL Server** 2008 R2 ou superior (para o Sync Agent)
- **Crystal Reports Runtime** instalado no servidor (para o CR Service)
- **Windows** (para Sync Agent e CR Service — executam como serviços Windows)

---

## Instalação Rápida

### 1. Clone o repositório

```bash
git clone https://github.com/AluBahia/ERPView.git
cd ERPView
```

### 2. Configure o Frontend

```bash
cd frontend
cp .env.example .env
# Edite .env com suas credenciais do Supabase
npm install
npm run dev
```

### 3. Execute o Schema no Supabase

Acesse o SQL Editor do seu projeto Supabase e execute em ordem:

```
1. supabase-schema.sql      — Tabelas principais (13 tabelas)
2. supabase-schema-v2.sql   — Tabelas complementares (8 tabelas)
3. supabase-seed.sql        — Dados de teste (opcional)
```

### 4. Configure o Sync Agent (servidor Windows)

```bash
cd sync-agent
cp .env.example .env
# Edite .env com credenciais do SQL Server e Supabase
npm install
npm run build
```

### 5. Configure o CR Service (servidor Windows)

```bash
cd cr-service
cp .env.example .env
# Edite .env com caminho dos arquivos .rpt e diretório temp
npm install
npm run build
```

---

## Variáveis de Ambiente

### `frontend/.env`

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
VITE_CR_SERVICE_URL=http://localhost:3001
```

### `sync-agent/.env`

```env
SQLSERVER_HOST=servidor-local
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=ERP_PRODUCAO
SQLSERVER_USER=erp_readonly
SQLSERVER_PASSWORD=sua_senha
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true

SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key

SYNC_INTERVAL_MINUTES=5
SYNC_CRITICAL_INTERVAL_MINUTES=1
LOG_LEVEL=info
LOG_FILE=C:\ERPView\logs\sync-agent.log
```

### `cr-service/.env`

```env
PORT=3001
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
CR_REPORTS_PATH=C:\CrystalReports\Relatorios
CR_TEMP_PATH=C:\CrystalReports\Temp
CR_CACHE_TTL_MINUTES=5
LOG_FILE=C:\ERPView\logs\cr-service.log
```

---

## Scripts Disponíveis

### Frontend

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run test         # Executar todos os testes
npm run test:ui      # Interface visual do Vitest
npm run test:coverage # Relatório de cobertura
```

### Sync Agent

```bash
npm run build        # Compilar TypeScript
npm run start        # Iniciar manualmente
npm run install-service  # Instalar como serviço Windows
```

### CR Service

```bash
npm run build        # Compilar TypeScript
npm run start        # Iniciar manualmente (porta 3001)
npm run test         # Executar testes
```

---

## Módulos do Dashboard

| Módulo | Tabela Supabase | Sync Agent |
|--------|----------------|-----------|
| Dashboard | `dashboard_kpis` | ✅ |
| Vendas | `pedidos_venda` | ✅ |
| Clientes | `clientes` | ✅ |
| Compras | `pedidos_compra` | ✅ |
| Fornecedores | `fornecedores` | ✅ |
| Estoque | `itens_estoque` | ✅ |
| Produtos | `produtos` | ✅ |
| Produção | `ordens_producao` | ✅ |
| Qualidade | `ncr` | — |
| Expedição | `pedidos_expedicao` | ✅ |
| Manutenção | `ordens_servico` | ✅ |
| Contas a Receber | `titulos_receber` | ✅ |
| Contas a Pagar | `titulos_pagar` | ✅ |
| Fluxo de Caixa | `fluxo_caixa` | — |
| DRE | `dre` | — |
| Custos | `custos` | — |
| Fiscal | `notas_fiscais` | ✅ |
| RH | `rh_colaboradores` | ✅ |
| Patrimônio | `bens_patrimoniais` | ✅ |

---

## Perfis de Acesso (RBAC)

| Perfil | Módulos |
|--------|---------|
| `admin` | Todos |
| `gerente` | Vendas, Financeiro, Produção, RH |
| `operador_vendas` | Vendas, Clientes, Estoque, Produtos |
| `operador_financeiro` | Receber, Pagar, Fluxo Caixa, DRE, Custos |
| `operador_producao` | Produção, Qualidade, Expedição, Manutenção |
| `visualizador` | Dashboard apenas |

---

## Testes

```bash
cd frontend && npm test
# Resultado esperado: 162+ testes passando

cd sync-agent && npm test
# Resultado esperado: 25+ testes passando

cd cr-service && npm test
# Resultado esperado: 5 testes passando
```

---

## Deploy (Vercel)

O frontend está configurado para deploy automático na Vercel:

```bash
cd frontend
npm run build
# O vercel.json já está configurado com rewrites para SPA
```

Configure as variáveis de ambiente no painel da Vercel:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CR_SERVICE_URL`

---

## Arquitetura de Segurança

- **RLS (Row Level Security)** ativado em todas as tabelas Supabase
- **JWT** validado pelo CR Service via Supabase Admin SDK
- **Somente leitura** no SQL Server (usuário `erp_readonly`)
- **Crystal Reports nunca modificado** — apenas acionado via bridge PowerShell
- **Zero `console.log`** em produção

---

## Documentação Adicional

- [`docs/MANUAL-USUARIO.md`](docs/MANUAL-USUARIO.md) — Guia de uso para usuários finais
- [`docs/INSTALACAO-SERVIDOR.md`](docs/INSTALACAO-SERVIDOR.md) — Instalação do Sync Agent e CR Service no servidor
- [`docs/plans/2026-05-21-erpview-sprints.md`](docs/plans/2026-05-21-erpview-sprints.md) — Plano técnico de sprints

---

## Licença

Uso interno — AluBahia. Todos os direitos reservados.
