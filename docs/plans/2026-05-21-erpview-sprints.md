# ERPView — Plano de Execução por Sprints

> **Arquitetura:** Frontend → Supabase (backend) ← Sync Agent → SQL Server
> **Crystal Reports:** Micro-serviço local separado, acionado sob demanda
> **Cada sprint só avança após todos os testes passarem**

---

## Sprint 0 — Infraestrutura de Testes + Schema (2 dias)

### Objetivo
Configurar ambiente de testes e finalizar schema Supabase com tabelas faltantes.

### Tarefas

- [ ] **0.1** Instalar Vitest + Testing Library + MSW no frontend
- [ ] **0.2** Criar tabelas faltantes: `perfis_usuario`, `log_auditoria`, `dashboard_kpis`, `fluxo_caixa`, `dre`, `custos`, `rh`
- [ ] **0.3** Criar script de seed com dados de teste representativos
- [ ] **0.4** Configurar `vitest.config.ts` com aliases e setup files
- [ ] **0.5** Criar helpers de teste: `renderWithProviders`, `createMockSupabase`

### Testes de Aceitação
```
✅ npm run test executa sem erros
✅ Vitest encontra e roda arquivos *.test.tsx
✅ Todas as 13+ tabelas existem no Supabase
✅ Seed popula ao menos 10 registros por tabela
✅ Helper renderWithProviders renderiza com Router+Query+Zustand
```

### Arquivos

| Ação | Arquivo |
|------|---------|
| Criar | `frontend/vitest.config.ts` |
| Criar | `frontend/src/test/setup.ts` |
| Criar | `frontend/src/test/helpers.tsx` |
| Criar | `frontend/src/test/mocks/supabase.ts` |
| Modificar | `frontend/package.json` |
| Criar | `supabase-schema-v2.sql` |
| Criar | `supabase-seed.sql` |

---

## Sprint 1 — Tipos, Supabase Client e Auth (3 dias)

### Objetivo
Tipar todo o projeto com types do Supabase, garantir auth funcional com testes.

### Tarefas

- [ ] **1.1** Gerar types do Supabase com `supabase gen types typescript`
- [ ] **1.2** Refatorar `src/types/index.ts` para usar Database types gerados
- [ ] **1.3** Tipar `supabase.ts` com `createClient<Database>`
- [ ] **1.4** Criar tabela `perfis_usuario` com campo `role` e RLS por perfil
- [ ] **1.5** Refatorar `authStore.ts` para carregar perfil do usuário
- [ ] **1.6** Criar hook `useProfile` que retorna permissões do usuário

### Testes (9 testes)

```
authStore:
- login válido → isAuthenticated = true
- login inválido → retorna error
- logout → limpa user, token, isAuthenticated
- initialize → carrega sessão existente
- initialize sem sessão → isLoading = false

useProfile:
- retorna perfil com role do usuário autenticado
- retorna null quando não autenticado
- role admin tem acesso a todos os módulos
- role comercial tem acesso apenas a módulos comerciais
```

### Critérios
```
✅ 9 testes passam
✅ Login funciona com usuário Supabase real
✅ tsc --noEmit sem erros
```

---

## Sprint 2 — Hooks de Dados por Módulo (5 dias)

### Objetivo
Criar hooks React Query tipados para cada módulo, eliminando mock data.

### Tarefas

- [ ] **2.1** `useVendas` — pedidos, KPIs (faturamento, ticket médio)
- [ ] **2.2** `useClientes` — lista, curva ABC, volume
- [ ] **2.3** `useEstoque` — itens, alertas, semáforo
- [ ] **2.4** `useReceber` — títulos, aging, projeção
- [ ] **2.5** `usePagar` — títulos, agenda, status
- [ ] **2.6** `useProdutos` — catálogo, margens, giro
- [ ] **2.7** `useFornecedores` — avaliação, homologação
- [ ] **2.8** `useProducao` — OPs, status, desvios
- [ ] **2.9** `useQualidade` — NCRs, status, prazos
- [ ] **2.10** `useExpedicao` — pedidos, status entrega
- [ ] **2.11** `useManutencao` — OS, preventiva, corretiva
- [ ] **2.12** `useFiscal` — NFs, obrigações
- [ ] **2.13** `usePatrimonio` — bens, depreciação
- [ ] **2.14** `useDashboardKPIs` — consolidação de todas as áreas
- [ ] **2.15** Refatorar `useKPIs` genérico

### Testes (~45 testes, 3-5 por hook)

Cada hook testa: retorna dados, aplica filtro, trata erro, calcula KPIs, loading state.

### Critérios
```
✅ ~45 testes passam
✅ Cada hook retorna dados tipados
✅ Filtros globais afetam todas as queries
```

---

## Sprint 3 — Migrar Páginas para Dados Reais (4 dias)

### Objetivo
Conectar as 18 páginas aos hooks reais, removendo mock data.

### Tarefas

- [ ] **3.1-3.9** Migrar cada uma das 18 páginas para hooks reais
- [ ] **3.10** Remover pasta `lib/mock-data/` por completo
- [ ] **3.11** Garantir loading skeletons, error states e empty states

### Testes (~36 testes, 2 por página)

Cada página testa: renderiza com dados, mostra skeleton/empty/error.

### Critérios
```
✅ ~36 testes passam
✅ Pasta lib/mock-data/ deletada
✅ Dashboard < 2 segundos
✅ tsc --noEmit sem erros
```

---

## Sprint 4 — Realtime + Filtros Avançados (3 dias)

### Objetivo
Subscriptions Realtime e filtros globais completos.

### Tarefas

- [ ] **4.1** Hook `useRealtimeSubscription` genérico
- [ ] **4.2-4.4** Integrar Realtime no Dashboard, Financeiro, Estoque
- [ ] **4.5** Refatorar `FilterBar.tsx` com DateRangePicker real
- [ ] **4.6** Refatorar `filterStore.ts` com datas como `Date | null`
- [ ] **4.7** Criar `DateRangePicker.tsx` com presets
- [ ] **4.8** Propagar filtros para todos os hooks

### Testes (13 testes)

```
useRealtimeSubscription: subscribe, INSERT/UPDATE/DELETE handlers, unsubscribe
DateRangePicker: renderiza presets, seleciona preset, custom range, reset
filterStore: setDateRange, setFilial, reset, persist
```

### Critérios
```
✅ 13 testes passam
✅ Inserir dado → dashboard atualiza sem refresh
✅ Filtros persistem entre navegações
```

---

## Sprint 5 — Sync Agent MVP (5 dias)

### Objetivo
Sync Agent: SQL Server 2008 R2 → Supabase.

### Estrutura

```
sync-agent/
├── src/
│   ├── index.ts, config.ts, mssql-client.ts, supabase-client.ts
│   ├── sync-engine.ts, table-sync.ts, type-mapper.ts
│   ├── change-tracker.ts, buffer.ts, logger.ts, health.ts
├── tests/ (5 arquivos de teste)
├── package.json, tsconfig.json, .env.example
```

### Tarefas

- [ ] **5.1-5.12** Implementar todos os módulos do Sync Agent + instalação como serviço Windows

### Testes (25 testes)

```
type-mapper: 9 testes de conversão de tipos
change-tracker: 4 testes de detecção de mudanças
buffer: 5 testes de persistência local
sync-engine: 5 testes de orquestração
table-sync: 5 testes de sync individual
```

### Critérios
```
✅ 25 testes passam
✅ Full load sincroniza todas as tabelas
✅ Sync incremental detecta e aplica mudanças
✅ Buffer local funciona durante queda de internet
✅ Instala como serviço Windows com auto-restart
```

---

## Sprint 6 — Controle de Acesso por Perfil (2 dias)

### Tarefas

- [ ] **6.1-6.7** RLS granular, `usePermissions`, Sidebar filtrada, página 403, log_auditoria

### Testes (7 testes)

```
- admin vê todos os 18 módulos
- comercial vê apenas 4 módulos
- financeiro vê apenas 5 módulos
- industrial vê apenas 6 módulos
- módulo sem permissão → 403
- login registra log
- acesso registra log
```

---

## Sprint 7 — Crystal Reports (4 dias)

### Tarefas

- [ ] **7.1-7.8** Micro-serviço local, bridge .NET, ExportButton no frontend

### Testes (10 testes)

```
reports-map: mapeia módulo, retorna null, lista parâmetros
cr-runner: gera PDF, erro sem CR, timeout, cleanup
ExportButton: renderiza, loading, download, toast erro
```

---

## Sprint 8 — PWA + Performance (3 dias)

### Tarefas

- [ ] **8.1-8.10** vite-plugin-pwa, manifest, Service Worker, cache, responsividade, Lighthouse

### Testes (7 testes)

```
Lighthouse PWA > 90, SW registra, instalável, cache offline
Dashboard < 2s, bottom-nav mobile, touch targets ≥ 44px
```

---

## Sprint 9 — Polish + Deploy (3 dias)

### Tarefas

- [ ] **9.1-9.9** Empty states, error boundaries, toasts, animações, deploy Netlify, validação

### Smoke Tests E2E (7 testes)

```
Login → Dashboard → Vendas → filtrar → voltar
Perfil comercial → sidebar filtrada
Realtime → inserir dado → atualiza
Export CR → PDF download
Mobile PWA → instalar → navegar
Offline → dados cacheados
Reconectar → atualiza
```

---

## Resumo

| Sprint | Foco | Dias | Testes |
|--------|------|------|--------|
| 0 | Infra de testes + Schema | 2 | 5 |
| 1 | Types + Auth | 3 | 9 |
| 2 | Hooks de dados | 5 | 45 |
| 3 | Páginas com dados reais | 4 | 36 |
| 4 | Realtime + Filtros | 3 | 13 |
| 5 | Sync Agent | 5 | 25 |
| 6 | Controle de acesso | 2 | 7 |
| 7 | Crystal Reports | 4 | 10 |
| 8 | PWA + Performance | 3 | 7 |
| 9 | Polish + Deploy | 3 | 7 |
| **Total** | | **~34 dias** | **~164 testes** |

## Dependências

```
Sprint 0 → 1 → 2 → 3 → 4 → 6 → 7 → 8 → 9
                                ↑
Sprint 5 (paralelo com 2-4) ───┘
```

> Sprint 5 (Sync Agent) pode rodar em **paralelo** com Sprints 2-4 (frontend).

## Regra de Ouro

**Nenhuma sprint avança sem:**
1. Todos os testes da sprint passando
2. `tsc --noEmit` sem erros
3. Zero `console.log`
4. Componentes ≤ 100 linhas
5. 100% pt-BR
