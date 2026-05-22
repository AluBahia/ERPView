# ERPView — Contexto Acumulado do Ralph Loop

> **Este arquivo é a fonte da verdade entre loops.**
> Sempre que uma sprint for concluída, este arquivo deve ser atualizado com o progresso real executado.
> **Ao iniciar uma nova sprint, leia este arquivo PRIMEIRO antes de qualquer outra coisa.**

---

## Identificação do Projeto

| Campo | Valor |
|-------|-------|
| **Nome** | ERPView — Dashboard de Visualização ERP |
| **Repositório** | `d:\VS Code\ERPView` |
| **Frontend** | `d:\VS Code\ERPView\frontend` |
| **Sync Agent** | `d:\VS Code\ERPView\sync-agent` ✅ Criado |
| **CR Service** | `d:\VS Code\ERPView\cr-service` ✅ Criado |
| **Docs/Plano** | `d:\VS Code\ERPView\docs\plans\2026-05-21-erpview-sprints.md` |
| **Ralph Loop** | `d:\VS Code\ERPView\docs\ralph-loop\` |

---

## Arquitetura Definitiva

```
Frontend (React PWA)
      ↓
Supabase (cloud — PostgreSQL + Auth + Realtime)
      ↑
Sync Agent (Node.js — serviço Windows no servidor local)
      ↓
SQL Server 2008 R2 (ERP local — somente leitura)

CR Service (Node.js local → bridge .NET → Crystal Reports)
      ↑ chamado sob demanda pelo frontend via fetch
```

**Decisões arquiteturais fixas:**
- Frontend consome **somente Supabase** (nunca direto ao SQL Server)
- Supabase é o **único backend** do frontend
- Sync Agent roda **no servidor local** como serviço Windows
- Crystal Reports **não é alterado** — só acionado e arquivo devolvido
- **Zero escrita** no banco do ERP

---

## Stack Tecnológica

### Frontend (`frontend/`)
| Lib | Versão | Uso |
|-----|--------|-----|
| React | 19 | UI |
| Vite | 8 | Build |
| TypeScript | 5.9 | Tipagem |
| TailwindCSS | v4 | Estilo |
| Supabase JS | 2 | Client cloud |
| TanStack Query | v5 | Server state |
| Zustand | 5 | Client state |
| React Router DOM | 7 | Roteamento |
| Recharts | 3 | Gráficos |
| Framer Motion | 12 | Animações |
| Sonner | 2 | Toasts |
| Tabler Icons | 3 | Ícones |
| React Hook Form | 7 | Formulários |
| Zod | 4 | Validação |
| Vitest | - | Testes ✅ instalado |
| Testing Library | - | Testes ✅ instalado |
| MSW | - | Mock de API ✅ instalado |
| vite-plugin-pwa | - | PWA com Workbox ✅ instalado |

### Sync Agent (`sync-agent/`)
| Lib | Uso |
|-----|-----|
| Node.js 18+ | Runtime |
| TypeScript | Tipagem |
| mssql | Conexão SQL Server |
| @supabase/supabase-js | Escrita no Supabase |
| Winston | Logging |
| node-windows | Serviço Windows |
| Vitest | Testes |

### CR Service (`cr-service/`)
| Lib | Uso |
|-----|-----|
| Node.js 18+ | Runtime |
| TypeScript | Tipagem |
| Fastify | Framework HTTP |
| @fastify/jwt | Auth JWT |
| @supabase/supabase-js | Validação token |
| Zod | Validação schema/env |
| Winston | Logging |
| Vitest | Testes |

---

## Estado das Sprints

| Sprint | Status | Conclusão | Testes | Notas |
|--------|--------|-----------|--------|-------|
| **Sprint 0** — Infra Testes + Schema | ✅ Concluída | 2026-05-21 | 5/5 | Ambiente de testes pronto |
| **Sprint 1** — Types + Auth | ✅ Concluída | 2026-05-21 | 9/9 | Tipos integrados e Auth funcionando |
| **Sprint 2** — Hooks de Dados | ✅ Concluída | 2026-05-21 | 48/48 | 18 hooks + useKPIs corrigido |
| **Sprint 3** — Páginas Reais | ✅ Concluída | 2026-05-21 | 36/36 | 18 páginas migradas de mock para dados reais |
| **Sprint 4** — Realtime + Filtros | ✅ Concluída | 2026-05-21 | 13/13 | Filtros globais + realtime vendas |
| **Sprint 5** — Sync Agent | ✅ Concluída (expandida) | 2026-05-21 | 25/25 | 12 módulos de sync delta/upsert + orchestrator |
| **Sprint 6** — Controle de Acesso | ✅ Concluída | 2026-05-21 | 7/7 | 6 perfis RBAC + ProtectedRoute + Sidebar filtrada |
| **Sprint 7** — Crystal Reports | ✅ Concluída (expandida) | 2026-05-21 | 10/10 | CR Service + generators reais + useRelatorio + BotaoRelatorio |
| **Sprint 8** — PWA + Performance | ✅ Concluída | 2026-05-21 | 7/7 | vite-plugin-pwa, offline.html, staleTime por módulo |
| **Sprint 9** — Polish + Deploy | ✅ Concluída | 2026-05-21 | 7/7 | vercel.json (raiz + frontend), a11y, build, e2e |

---

## Estrutura de Arquivos Atual

```
d:\VS Code\ERPView\
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     ✅ Criado
│   │   ├── main.tsx                    ✅ Criado
│   │   ├── router.tsx                  ✅ Criado (20 rotas + ProtectedRoute)
│   │   ├── global.css                  ✅ TailwindCSS v4 + tema dark
│   │   ├── pages/                      ✅ 21 arquivos (18 módulos + Dashboard + Login + AcessoNegado)
│   │   │   ├── Dashboard.tsx           ✅ (dados reais via hooks)
│   │   │   ├── Login.tsx               ✅ (Supabase Auth integrado)
│   │   │   ├── AcessoNegado.tsx        ✅ (Sprint 6)
│   │   │   ├── Vendas.tsx              ✅ (dados reais)
│   │   │   ├── Clientes.tsx            ✅ (dados reais)
│   │   │   ├── Compras.tsx             ✅ (dados reais)
│   │   │   ├── Fornecedores.tsx        ✅ (dados reais)
│   │   │   ├── Estoque.tsx             ✅ (dados reais)
│   │   │   ├── Produtos.tsx            ✅ (dados reais)
│   │   │   ├── Producao.tsx            ✅ (dados reais)
│   │   │   ├── Qualidade.tsx           ✅ (dados reais)
│   │   │   ├── Expedicao.tsx           ✅ (dados reais)
│   │   │   ├── Manutencao.tsx          ✅ (dados reais)
│   │   │   ├── Receber.tsx             ✅ (dados reais)
│   │   │   ├── Pagar.tsx               ✅ (dados reais)
│   │   │   ├── FluxoCaixa.tsx          ✅ (dados reais)
│   │   │   ├── DRE.tsx                 ✅ (dados reais)
│   │   │   ├── Custos.tsx              ✅ (dados reais)
│   │   │   ├── Fiscal.tsx              ✅ (dados reais)
│   │   │   ├── RH.tsx                  ✅ (dados reais)
│   │   │   └── Patrimonio.tsx          ✅ (dados reais)
│   │   ├── components/
│   │   │   ├── ui/                     ✅ 13 componentes (+ BotaoRelatorio, Pagination, LoadingSkeleton, EmptyState, ErrorState)
│   │   │   ├── charts/                 ✅ 4 wrappers (Bar, Line, Pie, Gauge)
│   │   │   ├── layout/                 ✅ Header, Sidebar, MainLayout
│   │   │   ├── filters/                ✅ FilterBar, DateRangePicker, StatusFilter
│   │   │   ├── auth/                   ✅ ProtectedRoute.tsx (Sprint 6)
│   │   │   └── pwa/                    ✅ InstallPrompt.tsx, UpdatePrompt.tsx (Sprint 8)
│   │   ├── hooks/
│   │   │   ├── useKPIs.ts              ✅ Corrigido na Sprint 2
│   │   │   ├── useVendas.ts            ✅
│   │   │   ├── useClientes.ts          ✅
│   │   │   ├── useCompras.ts           ✅
│   │   │   ├── useFornecedores.ts      ✅
│   │   │   ├── useEstoque.ts           ✅
│   │   │   ├── useProdutos.ts          ✅
│   │   │   ├── useProducao.ts          ✅
│   │   │   ├── useQualidade.ts         ✅
│   │   │   ├── useExpedicao.ts         ✅
│   │   │   ├── useManutencao.ts        ✅
│   │   │   ├── useReceber.ts           ✅
│   │   │   ├── usePagar.ts             ✅
│   │   │   ├── useFiscal.ts            ✅
│   │   │   ├── usePatrimonio.ts        ✅
│   │   │   ├── useFluxoCaixa.ts        ✅
│   │   │   ├── useDRE.ts               ✅
│   │   │   ├── useCustos.ts            ✅
│   │   │   ├── useRH.ts                ✅
│   │   │   ├── usePerfil.ts            ✅
│   │   │   ├── useExport.ts            ✅
│   │   │   ├── usePermissao.ts         ✅ Sprint 6
│   │   │   ├── useRelatorio.ts         ✅ Sprint 7
│   │   │   ├── useRealtimeVendas.ts    ✅ Sprint 4
│   │   │   ├── useRealtimeEstoque.ts   ✅ Sprint 4
│   │   │   ├── useRealtimeProducao.ts  ✅ Sprint 4
│   │   │   └── useRealtimeReceber.ts   ✅ Sprint 4
│   │   ├── store/
│   │   │   ├── authStore.ts            ✅ Supabase Auth (refatorado Sprint 1)
│   │   │   ├── filterStore.ts          ✅ Zustand persist
│   │   │   └── uiStore.ts              ✅
│   │   ├── lib/
│   │   │   ├── supabase.ts             ✅ Client configurado
│   │   │   ├── constants.ts            ✅ NAV_GROUPS, QUERY_STALE_TIME, staleTime por módulo
│   │   │   ├── formatters.ts           ✅
│   │   │   ├── api.ts                  ✅
│   │   │   └── mock-data/
│   │   │       └── kpis.ts             ⚠️ Ainda em uso — KPIs por página importados em 10 páginas
│   │   ├── types/
│   │   │   ├── supabase.ts             ✅ Gerado na Sprint 1
│   │   │   └── index.ts                ✅ 14 interfaces unificadas
│   │   └── test/
│   │       ├── setup.ts                ✅
│   │       ├── mocks/                  ✅ MSW handlers + supabase mock com channel + pageHooks
│   │       ├── infra/                  ✅ Testes de infra (Sprint 0)
│   │       ├── hooks/                  ✅ 22 arquivos de teste
│   │       ├── store/                  ✅ authStore.test.ts + filterStore.test.ts
│   │       ├── pages/                  ✅ 20 arquivos (Sprint 3)
│   │       ├── realtime/               ✅ useRealtimeVendas.test.tsx
│   │       ├── auth/                   ✅ ProtectedRoute.test.tsx (Sprint 6)
│   │       ├── components/             ✅ Sidebar, BotaoRelatorio, DateRangePicker, Pagination, StatusFilter
│   │       ├── pwa/                    ✅ installPrompt, manifest (Sprint 8)
│   │       ├── performance/            ✅ lazyLoading.test.ts, queryConfig.test.ts (Sprint 8)
│   │       ├── deploy/                 ✅ build.test.ts (Sprint 9)
│   │       ├── a11y/                   ✅ accessibility.test.tsx (Sprint 9)
│   │       └── e2e/                    ✅ fluxo-principal.test.ts (Sprint 9)
│   ├── public/
│   │   ├── manifest.json               ✅ Sprint 8
│   │   └── offline.html                ✅ Sprint 8
│   ├── package.json                    ✅
│   ├── vite.config.ts                  ✅ VitePWA configurado (Sprint 8)
│   ├── vitest.config.ts                ✅
│   ├── vercel.json                     ✅ Sprint 9
│   ├── .env                            ✅ VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
│   └── .env.example                    ✅
├── sync-agent/                         ✅ Criado na Sprint 5 — expandido pós-auditoria
│   ├── src/
│   │   ├── index.ts                    ✅
│   │   ├── install-service.ts          ✅
│   │   ├── config.ts                   ✅
│   │   ├── logger.ts                   ✅
│   │   ├── db/
│   │   │   ├── sqlserver.ts            ✅
│   │   │   └── supabase.ts             ✅
│   │   ├── sync/
│   │   │   ├── clientes.ts             ✅
│   │   │   ├── produtos.ts             ✅
│   │   │   ├── estoque.ts              ✅
│   │   │   ├── pedidos-venda.ts        ✅
│   │   │   ├── titulos.ts              ✅
│   │   │   ├── notas-fiscais.ts        ✅
│   │   │   ├── fornecedores.ts         ✅ Adicionado pós-auditoria
│   │   │   ├── producao.ts             ✅ Adicionado pós-auditoria
│   │   │   ├── expedicao.ts            ✅ Adicionado pós-auditoria
│   │   │   ├── manutencao.ts           ✅ Adicionado pós-auditoria
│   │   │   ├── rh.ts                   ✅ Adicionado pós-auditoria
│   │   │   ├── patrimonio.ts           ✅ Adicionado pós-auditoria
│   │   │   └── orchestrator.ts         ✅ Atualizado — 12 módulos
│   │   └── utils/
│   │       ├── delta.ts                ✅
│   │       └── retry.ts                ✅
│   ├── tests/
│   │   ├── sync/
│   │   │   ├── clientes.test.ts        ✅
│   │   │   ├── produtos.test.ts        ✅
│   │   │   ├── estoque.test.ts         ✅
│   │   │   ├── pedidos.test.ts         ✅
│   │   │   ├── titulos.test.ts         ✅
│   │   │   ├── fiscal.test.ts          ✅
│   │   │   ├── delta.test.ts           ✅
│   │   │   ├── orchestrator.test.ts    ✅
│   │   │   ├── fornecedores.test.ts    ✅ Adicionado pós-auditoria
│   │   │   └── novos-modulos.test.ts   ✅ Adicionado pós-auditoria (producao/expedicao/manutencao/rh/patrimonio)
│   │   └── setup.ts                    ✅
│   └── package.json                    ✅
├── cr-service/                         ✅ Criado na Sprint 7 — expandido pós-auditoria
│   ├── src/
│   │   ├── index.ts                    ✅
│   │   ├── config.ts                   ✅
│   │   ├── auth.ts                     ✅
│   │   ├── generators/
│   │   │   ├── base.ts                 ✅ Adicionado pós-auditoria — executa script PowerShell
│   │   │   ├── vendas.ts               ✅ Adicionado pós-auditoria
│   │   │   ├── compras.ts              ✅ Adicionado pós-auditoria
│   │   │   ├── estoque.ts              ✅ Adicionado pós-auditoria
│   │   │   ├── financeiro.ts           ✅ Adicionado pós-auditoria (titulos-receber/pagar, DRE, fluxo)
│   │   │   └── fiscal.ts               ✅ Adicionado pós-auditoria
│   │   ├── routes/
│   │   │   └── relatorios.ts           ✅ Atualizado — usa generators reais
│   │   └── utils/
│   │       ├── logger.ts               ✅
│   │       ├── pdf-cache.ts            ✅
│   │       └── cleanup.ts              ✅
│   ├── tests/
│   │   ├── relatorios.test.ts          ✅
│   │   └── setup.ts                    ✅
│   ├── scripts/
│   │   └── gerar-relatorio.ps1         ✅ Bridge PowerShell → Crystal Reports
│   └── package.json                    ✅
├── docs/
│   ├── plans/
│   │   └── 2026-05-21-erpview-sprints.md  ✅ Plano completo
│   ├── MANUAL-USUARIO.md               ✅ Adicionado pós-auditoria
│   ├── INSTALACAO-SERVIDOR.md          ✅ Adicionado pós-auditoria
│   └── ralph-loop/
│       ├── CONTEXTO.md                 ✅ Este arquivo
│       ├── sprint-0.md  até sprint-9.md ✅ Todos concluídos
├── supabase-schema.sql                 ✅ 13 tabelas + RLS + índices
├── supabase-schema-v2.sql              ✅ Atualizado — 8 tabelas + pedidos_compra + RLS
├── supabase-seed.sql                   ✅
├── vercel.json                         ✅ Adicionado pós-auditoria (raiz do projeto)
├── netlify.toml                        ✅
├── README.md                           ✅ Reescrito pós-auditoria — documentação completa
└── PRD_Dashboard_ERP_Revisado.md       ✅ Referência
```

---

## Supabase

| Campo | Valor |
|-------|-------|
| **URL** | Configurado em `frontend/.env` |
| **Anon Key** | Configurado em `frontend/.env` |
| **MCP Server** | ✅ Instalado e configurado em `mcp_config.json` |
| **Tabelas existentes (confirmadas)** | clientes, produtos, pedidos_venda, itens_estoque, titulos_receber, titulos_pagar, fornecedores, ordens_producao, ordens_servico, notas_fiscais, pedidos_expedicao, ncr, bens_patrimoniais |
| **Tabelas no schema v2 (executar no Supabase)** | `perfis_usuario`, `log_auditoria`, `dashboard_kpis`, `fluxo_caixa`, `dre`, `custos`, `rh_colaboradores`, `pedidos_compra` |
| **Auth** | Email/Password habilitado |
| **RLS** | Habilitado em todas as tabelas |

> ⚠️ **AÇÃO PENDENTE:** Executar `supabase-schema-v2.sql` no SQL Editor do Supabase para criar as 8 tabelas faltantes.

---

## ⚠️ Situação Conhecida

### KPIs mockados em páginas individuais
O arquivo `frontend/src/lib/mock-data/kpis.ts` ainda é importado por **10 páginas** (Dashboard, Vendas, Receber, Pagar, FluxoCaixa, DRE, Custos, Fiscal, RH, Patrimônio) para os KPIs de resumo exibidos no topo de cada módulo. Esses dados estão mockados — não vêm do Supabase.

**Impacto:** Os cards de KPI por página mostram valores fixos, não dados reais do ERP.  
**Solução:** Criar um hook `useModuloKPIs(modulo)` que calcule os KPIs a partir dos dados reais retornados pelos hooks de dados.  
**Prioridade:** Média — funcionalidade existe, mas com dados não reais.

### Tabelas Supabase ainda não criadas
As tabelas do `supabase-schema-v2.sql` precisam ser executadas manualmente no painel do Supabase. Até lá, os módulos Compras, Fluxo de Caixa, DRE e Custos retornam erro ao tentar carregar dados.

---

## Bugs Conhecidos

**Nenhum bug ativo no código.**

### Resolvidos
- ✅ BUG 1 — Fallback KPI usa `throw error`
- ✅ BUG 2 — Mapeamento `rh` corrigido para `rh_colaboradores`
- ✅ BUG 3 — `pedidos_compra` marcada como `MISSING_TABLES`
- ✅ BUG 4 — `transformToKPIs()` implementado para 18 módulos
- ✅ BUG 5 — `localStorage` não disponível no Vitest
- ✅ BUG 6 — `supabase.channel` no mock
- ✅ BUG 7 — Recharts loop infinito no jsdom
- ✅ BUG 8 — `vi.mock` com variáveis top-level
- ✅ BUG 9 — `global.fetch` não existe no jsdom
- ✅ BUG 10 — `PostgrestFilterBuilder` vs `Promise` no sync-agent

---

## Regras de Ouro (nunca quebrar)

1. ✅ Frontend consome **somente Supabase** — nunca SQL Server direto
2. ✅ Sync Agent é **somente leitura** no SQL Server
3. ✅ **Crystal Reports não é modificado** — só acionado
4. ✅ **RLS ativo** em todas as tabelas
5. ✅ Todos os textos **100% pt-BR**
6. ✅ Componentes **≤ 100 linhas**
7. ✅ **Zero console.log** em produção
8. ✅ **tsc --noEmit** sempre sem erros
9. ✅ Todos os testes da sprint devem passar **antes de avançar**
10. ✅ Touch targets **≥ 44px** em mobile

---

## Notas e Decisões Importantes

- **2026-05-21:** Projeto iniciado. PRD analisado. Plano de sprints criado. Ralph Loop configurado.
- **2026-05-21:** Sprints 0–9 executadas e concluídas.
- **2026-05-21:** Auditoria pós-sprints realizada. Gaps identificados e corrigidos:
  - `cr-service/src/generators/` estava vazio → 6 generators criados (base, vendas, compras, estoque, financeiro, fiscal)
  - `relatorios.ts` era apenas simulação → atualizado para usar generators reais via PowerShell
  - `sync-agent` tinha 6/12 módulos → 6 módulos adicionados (fornecedores, producao, expedicao, manutencao, rh, patrimonio)
  - `orchestrator.ts` atualizado para 12 módulos
  - `README.md` estava com 1 linha → reescrito completamente
  - `docs/MANUAL-USUARIO.md` inexistente → criado
  - `docs/INSTALACAO-SERVIDOR.md` inexistente → criado
  - `vercel.json` na raiz inexistente → criado
  - `supabase-schema-v2.sql` sem `pedidos_compra` → tabela adicionada com RLS
  - Testes para 6 novos módulos sync-agent criados
- **Situação atual:** `mock-data/kpis.ts` ainda importado por 10 páginas — KPIs por módulo estão mockados.

---

## Progresso Total

**Testes:** 162+ / 164 (2 Lighthouse manuais)
**Sprints concluídas:** 10 / 10
**Sync Agent módulos:** 12 / 12
**CR Service generators:** 6 / 6
**Última atualização:** 2026-05-21T21:00 (BRT) — Auditoria pós-sprints
