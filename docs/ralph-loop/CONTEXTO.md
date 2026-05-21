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
| **Sync Agent** | `d:\VS Code\ERPView\sync-agent` (a criar) |
| **CR Service** | `d:\VS Code\ERPView\cr-service` (a criar) |
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

---

## Estado das Sprints

| Sprint | Status | Conclusão | Testes | Notas |
|--------|--------|-----------|--------|-------|
| **Sprint 0** — Infra Testes + Schema | ✅ Concluída | 2026-05-21 | 5/5 | Ambiente de testes pronto |
| **Sprint 1** — Types + Auth | ✅ Concluída | 2026-05-21 | 9/9 | Tipos integrados e Auth funcionando |
| **Sprint 2** — Hooks de Dados | ⏳ Pendente | — | 0/45 | Bloqueada — ver bugs abaixo |
| **Sprint 3** — Páginas Reais | ⏳ Pendente | — | 0/36 | — |
| **Sprint 4** — Realtime + Filtros | ⏳ Pendente | — | 0/13 | — |
| **Sprint 5** — Sync Agent | ⏳ Pendente | — | 0/25 | Paralelo com 2-4 |
| **Sprint 6** — Controle de Acesso | ⏳ Pendente | — | 0/7 | — |
| **Sprint 7** — Crystal Reports | ⏳ Pendente | — | 0/10 | — |
| **Sprint 8** — PWA + Performance | ⏳ Pendente | — | 0/7 | — |
| **Sprint 9** — Polish + Deploy | ⏳ Pendente | — | 0/7 | — |

---

## Estrutura de Arquivos Atual

```
d:\VS Code\ERPView\
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     ✅ Criado
│   │   ├── main.tsx                    ✅ Criado
│   │   ├── router.tsx                  ✅ Criado (19 rotas lazy)
│   │   ├── global.css                  ✅ TailwindCSS v4 + tema dark
│   │   ├── pages/                      ✅ 20 arquivos (18 módulos + Dashboard + Login)
│   │   │   ├── Dashboard.tsx           ✅ (usa mock data — migrar Sprint 3)
│   │   │   ├── Login.tsx               ✅ (Supabase Auth integrado)
│   │   │   ├── Vendas.tsx              ✅ (mock — usa useKPIs com fallback ⚠️ bug)
│   │   │   ├── Clientes.tsx            ✅ (mock)
│   │   │   ├── Compras.tsx             ✅ (mock — tabela pedidos_compra FALTANDO no DB)
│   │   │   ├── Fornecedores.tsx        ✅ (mock)
│   │   │   ├── Estoque.tsx             ✅ (mock)
│   │   │   ├── Produtos.tsx            ✅ (mock)
│   │   │   ├── Producao.tsx            ✅ (mock)
│   │   │   ├── Qualidade.tsx           ✅ (mock)
│   │   │   ├── Expedicao.tsx           ✅ (mock)
│   │   │   ├── Manutencao.tsx          ✅ (mock)
│   │   │   ├── Receber.tsx             ✅ (mock)
│   │   │   ├── Pagar.tsx               ✅ (mock)
│   │   │   ├── FluxoCaixa.tsx          ✅ (mock)
│   │   │   ├── DRE.tsx                 ✅ (mock)
│   │   │   ├── Custos.tsx              ✅ (mock)
│   │   │   ├── Fiscal.tsx              ✅ (mock)
│   │   │   ├── RH.tsx                  ✅ (mock)
│   │   │   └── Patrimonio.tsx          ✅ (mock)
│   │   ├── components/
│   │   │   ├── ui/                     ✅ 10 componentes (KPICard, DataTable, Badge, etc.)
│   │   │   ├── charts/                 ✅ 4 wrappers (Bar, Line, Pie, Gauge)
│   │   │   ├── layout/                 ✅ Header, Sidebar, MainLayout
│   │   │   └── filters/                ✅ FilterBar.tsx (básico)
│   │   ├── hooks/
│   │   │   ├── useKPIs.ts              ✅ (básico — ⚠️ BUG de fallback — ver bugs)
│   │   │   ├── usePerfil.ts            ✅ Criado na Sprint 1
│   │   │   └── useExport.ts            ✅
│   │   ├── store/
│   │   │   ├── authStore.ts            ✅ Supabase Auth (refatorado Sprint 1)
│   │   │   ├── filterStore.ts          ✅ Zustand persist
│   │   │   └── uiStore.ts              ✅
│   │   ├── lib/
│   │   │   ├── supabase.ts             ✅ Client configurado
│   │   │   ├── constants.ts            ✅ NAV_GROUPS, QUERY_STALE_TIME
│   │   │   ├── formatters.ts           ✅
│   │   │   ├── api.ts                  ✅
│   │   │   └── mock-data/
│   │   │       └── kpis.ts             ⚠️ REMOVER na Sprint 3
│   │   ├── types/
│   │   │   ├── supabase.ts             ✅ Gerado na Sprint 1
│   │   │   └── index.ts                ✅ 14 interfaces unificadas
│   │   └── test/
│   │       ├── setup.ts                ✅ Criado (Sprint 0)
│   │       ├── mocks/                  ✅ MSW handlers configurados
│   │       ├── infra/                  ✅ Testes de infra (Sprint 0)
│   │       ├── hooks/
│   │       │   └── usePerfil.test.tsx  ✅ 3 testes (Sprint 1)
│   │       ├── store/
│   │       │   └── authStore.test.ts   ✅ 5 testes (Sprint 1)
│   │       └── pages/
│   │           └── Login.test.tsx      ✅ 1 teste (Sprint 1)
│   ├── test-tables.js                  ✅ Script diagnóstico de tabelas Supabase
│   ├── package.json                    ✅
│   ├── vite.config.ts                  ✅
│   ├── vitest.config.ts                ✅ Criado (Sprint 0)
│   ├── .env                            ✅ VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
│   └── .env.example                    ✅
├── docs/
│   ├── plans/
│   │   └── 2026-05-21-erpview-sprints.md  ✅ Plano completo
│   └── ralph-loop/
│       ├── CONTEXTO.md                 ✅ Este arquivo (atualizado 2026-05-21)
│       ├── sprint-0.md                 ✅ Concluído
│       ├── sprint-1.md                 ✅ Concluído
│       ├── sprint-2.md → sprint-9.md   ✅ Templates criados
├── supabase-schema.sql                 ✅ 13 tabelas + RLS + índices
├── supabase-schema-v2.sql              ✅ perfis_usuario, rh_colaboradores, etc.
├── supabase-seed.sql                   ✅ Criado
├── netlify.toml                        ✅
└── PRD_Dashboard_ERP_Revisado.md       ✅ Referência

sync-agent/                             ⏳ A criar na Sprint 5
cr-service/                             ⏳ A criar na Sprint 7
```

---

## Supabase

| Campo | Valor |
|-------|-------|
| **URL** | Configurado em `frontend/.env` |
| **Anon Key** | Configurado em `frontend/.env` |
| **MCP Server** | ✅ Instalado e configurado em `mcp_config.json` |
| **Tabelas existentes (confirmadas)** | clientes, produtos, pedidos_venda, itens_estoque, titulos_receber, titulos_pagar, fornecedores, ordens_producao, ordens_servico, notas_fiscais, pedidos_expedicao, ncr, bens_patrimoniais |
| **Tabelas faltantes no DB** | `pedidos_compra` ❌, `dashboard_kpis` ❌, `fluxo_caixa` ❌, `dre` ❌, `custos` ❌ |
| **Tabelas schema v2 (a verificar)** | `perfis_usuario`, `rh_colaboradores`, `log_auditoria` |
| **Auth** | Email/Password habilitado |
| **RLS** | Habilitado em todas as tabelas existentes |

---

## ⚠️ Bugs Conhecidos (resolver na Sprint 2)

### BUG 1 — Fallback KPI não funciona
**Arquivo:** `frontend/src/hooks/useKPIs.ts`  
**Problema:** Quando uma query Supabase falha (tabela inexistente, erro de RLS, etc.), o hook retorna `[]` (array vazio). Como `[]` é truthy em JS, o padrão `kpis ?? mockKPIs` nas páginas **nunca usa o mock** — exibe lista vazia.  
**Impacto:** Todas as páginas com `useKPIs` mostram KPIs em branco ao invés do mock.  
**Correção:** Alterar o retorno em caso de erro para `null` em vez de `[]`, ou usar `data?.length ? data : mockKPIs`.

```typescript
// ATUAL (bugado):
if (error) {
  console.error(...);
  return [];  // ← [] é truthy, fallback nunca dispara
}

// CORRETO:
if (error) throw error;  // deixa React Query tratar via isError
// ou: return null;
```

### BUG 2 — Mapeamento de tabela `rh` incorreto
**Arquivo:** `frontend/src/hooks/useKPIs.ts` linha 26  
**Problema:** `rh: 'rh'` mas a tabela no DB é `rh_colaboradores`.  
**Correção:** Alterar para `rh: 'rh_colaboradores'`.

### BUG 3 — Tabela `pedidos_compra` inexistente
**Arquivo:** `frontend/src/hooks/useKPIs.ts` linha 12  
**Problema:** `compras: 'pedidos_compra'` mas esta tabela não existe no schema atual.  
**Correção:** Criar migration SQL adicionando a tabela `pedidos_compra` com RLS, ou redirecionar para tabela existente.

### BUG 4 — `transformToKPIs()` retorna `[]` para quase todos os módulos
**Arquivo:** `frontend/src/hooks/useKPIs.ts` linhas 57-74  
**Problema:** O `switch` só trata o caso `dashboard` — todos os outros módulos caem no `default: return []`. Os dados são buscados mas descartados na transformação.  
**Correção:** Implementar transformação real por módulo na Sprint 2.

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
- **2026-05-21:** Sprint 0 concluída — ambiente de testes pronto (Vitest + Testing Library + MSW).
- **2026-05-21:** Sprint 1 concluída — tipos Supabase gerados, authStore refatorado, usePerfil criado, Login atualizado. 9/9 testes passando.
- **2026-05-21:** Supabase MCP instalado e configurado. Diagnóstico de tabelas realizado via `test-tables.js`.
- **2026-05-21:** Análise de `useKPIs.ts` revelou 4 bugs críticos que impedem o fallback para mock data. Corrigir como **primeira ação da Sprint 2**.
- **Próximo loop:** Sprint 2 — Hooks de Dados (começar corrigindo os 4 bugs acima)

---

## Progresso Total

**Testes:** 14 / 164  
**Sprints concluídas:** 2 / 10  
**Última atualização:** 2026-05-21T15:00 (BRT)
