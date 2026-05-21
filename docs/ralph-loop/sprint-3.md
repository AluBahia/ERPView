# Sprint 3 — Páginas Reais (18 módulos)

> **Status:** ⏳ Pendente  
> **Duração estimada:** 4 dias  
> **Pré-requisito:** Sprint 2 ✅ (59 testes passando)  
> **Próxima:** Sprint 4 — Realtime + Filtros Avançados

---

## Objetivo da Sprint

Migrar todas as 18 páginas de módulo de dados mock para dados reais via os hooks criados na Sprint 2. Cada página deve ter loading skeleton, error state com retry, e empty state com call-to-action.

---

## Checklist por Página

Cada página segue o padrão:
```tsx
// ❌ Antes (mock):
const data = MOCK_VENDAS

// ✅ Depois (real):
const { data, isLoading, error, refetch } = useVendas(filtros)
if (isLoading) return <LoadingSkeleton />
if (error) return <ErrorState onRetry={refetch} />
if (!data?.length) return <EmptyState />
```

### Páginas a migrar:
- [ ] `Dashboard.tsx` — usar `useKPIs` real + gráficos reais
- [ ] `Vendas.tsx` — `useVendas` + tabela paginada
- [ ] `Clientes.tsx` — `useClientes` + cards
- [ ] `Compras.tsx` — `useCompras` + timeline
- [ ] `Fornecedores.tsx` — `useFornecedores` + lista
- [ ] `Estoque.tsx` — `useEstoque` + alertas de mínimo
- [ ] `Produtos.tsx` — `useProdutos` + grid de cards
- [ ] `Producao.tsx` — `useProducao` + kanban/lista
- [ ] `Qualidade.tsx` — `useQualidade` + NCRs abertos
- [ ] `Expedicao.tsx` — `useExpedicao` + status entregas
- [ ] `Manutencao.tsx` — `useManutencao` + ordens abertas
- [ ] `Receber.tsx` — `useReceber` + vencimentos + totalizadores
- [ ] `Pagar.tsx` — `usePagar` + vencimentos + totalizadores
- [ ] `FluxoCaixa.tsx` — `useFluxoCaixa` + gráfico mensal
- [ ] `DRE.tsx` — `useDRE` + tabela estruturada
- [ ] `Custos.tsx` — `useCustos` + breakdown por linha
- [ ] `Fiscal.tsx` — `useFiscal` + lista de NFs
- [ ] `RH.tsx` — `useRH` + headcount
- [ ] `Patrimonio.tsx` — `usePatrimonio` + depreciation chart

### Tarefas globais:
- [ ] Criar `components/ui/LoadingSkeleton.tsx` genérico
- [ ] Criar `components/ui/ErrorState.tsx` com prop `onRetry`
- [ ] Criar `components/ui/EmptyState.tsx` com prop `label` e `icon`
- [ ] Remover `src/lib/mock-data/kpis.ts`
- [ ] Remover todos os imports de mock data nas páginas
- [ ] Rodar `tsc --noEmit` — zero erros

---

## Testes da Sprint (36 testes obrigatórios)

### Padrão: 2 testes por página

```typescript
// Para cada página:
// 1. Renderiza skeleton enquanto carregando
// 2. Renderiza dados reais quando hook retorna com sucesso
// (erro state e empty state cobertos pelos hooks — Sprint 2)
```

### Arquivos de teste (2 testes cada):
- `src/test/pages/Dashboard.test.tsx` (2)
- `src/test/pages/Vendas.test.tsx` (2)
- `src/test/pages/Clientes.test.tsx` (2)
- `src/test/pages/Compras.test.tsx` (2)
- `src/test/pages/Fornecedores.test.tsx` (2)
- `src/test/pages/Estoque.test.tsx` (2)
- `src/test/pages/Produtos.test.tsx` (2)
- `src/test/pages/Producao.test.tsx` (2)
- `src/test/pages/Qualidade.test.tsx` (2)
- `src/test/pages/Expedicao.test.tsx` (2)
- `src/test/pages/Manutencao.test.tsx` (2)
- `src/test/pages/Receber.test.tsx` (2)
- `src/test/pages/Pagar.test.tsx` (2)
- `src/test/pages/FluxoCaixa.test.tsx` (2)
- `src/test/pages/DRE.test.tsx` (2)
- `src/test/pages/Custos.test.tsx` (2)
- `src/test/pages/Fiscal.test.tsx` (2)
- `src/test/pages/RH.test.tsx` (2)

**Total: 36 testes**  
**Critério:** Todos os 36 passam (+ acumulados: 95 de 164)

---

## Resultado dos Testes

```
Executado em: —
Total acumulado: 0/95 — SPRINT BLOQUEADA
```

---

## Notas de Execução

_(Preencher durante/após a execução)_

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint:
- [ ] Status Sprint 3 → ✅ Concluída  
- [ ] Testes: `95 / 164`
- [ ] Marcar todas as 18 páginas como ✅ (dados reais)
- [ ] Marcar `mock-data/kpis.ts` como 🗑️ Removido
