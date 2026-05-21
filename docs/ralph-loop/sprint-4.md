# Sprint 4 — Realtime + Filtros Avançados

> **Status:** ⏳ Pendente  
> **Duração estimada:** 3 dias  
> **Pré-requisito:** Sprint 3 ✅ (95 testes passando)  
> **Próxima:** Sprint 5 (paralelo) / Sprint 6

---

## Objetivo da Sprint

Adicionar atualização em tempo real (Supabase Realtime) nos módulos mais críticos e implementar o sistema de filtros avançados com persistência de estado (Zustand + URL params).

---

## Checklist de Execução

### 1. Supabase Realtime (módulos prioritários)
- [ ] Criar `hooks/useRealtimeVendas.ts` — subscription em `pedidos_venda`
- [ ] Criar `hooks/useRealtimeEstoque.ts` — subscription em `itens_estoque`
- [ ] Criar `hooks/useRealtimeProducao.ts` — subscription em `ordens_producao`
- [ ] Criar `hooks/useRealtimeReceber.ts` — subscription em `titulos_receber`
- [ ] Implementar `invalidateQueries` ao receber evento Realtime
- [ ] Adicionar indicador visual "Ao Vivo" no header quando Realtime ativo

### 2. Filtros Avançados
- [ ] Criar `components/filters/DateRangePicker.tsx`
- [ ] Criar `components/filters/MultiSelect.tsx`
- [ ] Criar `components/filters/StatusFilter.tsx`
- [ ] Atualizar `FilterBar.tsx` para compor os novos componentes
- [ ] Implementar persistência de filtros em URL params (`useSearchParams`)
- [ ] Implementar botão "Limpar filtros" que reseta tudo
- [ ] Sincronizar `filterStore` (Zustand) com URL params

### 3. Paginação
- [ ] Criar `components/ui/Pagination.tsx`
- [ ] Integrar paginação server-side nos hooks (range do Supabase)
- [ ] Adicionar controle de page size (10/25/50/100 itens)

---

## Testes da Sprint (13 testes obrigatórios)

### Arquivo: `src/test/realtime/useRealtimeVendas.test.ts`
```typescript
// TESTE 1: Subscription criada ao montar
test('useRealtimeVendas cria subscription ao montar componente')

// TESTE 2: Invalida query ao receber evento INSERT
test('ao receber evento INSERT, React Query invalida cache de vendas')

// TESTE 3: Subscription removida ao desmontar
test('useRealtimeVendas cancela subscription ao desmontar')
```

### Arquivo: `src/test/components/FilterBar.test.tsx`
```typescript
// TESTE 4: DateRangePicker aplica filtro de data
test('DateRangePicker atualiza queryKey ao selecionar intervalo')

// TESTE 5: StatusFilter filtra por status
test('StatusFilter aplica filtro de status corretamente')

// TESTE 6: Limpar filtros reseta todos os valores
test('botão Limpar reseta FilterBar para estado inicial')

// TESTE 7: Filtros persistem na URL
test('filtros são preservados ao recarregar a URL com params')
```

### Arquivo: `src/test/components/Pagination.test.tsx`
```typescript
// TESTE 8: Paginação renderiza controles corretos
test('Pagination renderiza botões Anterior/Próximo e página atual')

// TESTE 9: Clique em próxima página chama callback
test('clicar em Próximo invoca onPageChange com page + 1')

// TESTE 10: Page size controla quantidade de itens
test('selecionar 50 itens por página atualiza pageSize no hook')
```

### Arquivo: `src/test/store/filterStore.test.ts`
```typescript
// TESTE 11: filterStore sincroniza com URL params
test('filterStore lê filtros iniciais da URL ao montar')

// TESTE 12: Atualizar filterStore atualiza URL
test('setFiltro atualiza URLSearchParams correspondente')

// TESTE 13: Reset limpa URL e store
test('resetFiltros limpa todos os URLSearchParams e zera store')
```

**Total: 13 testes**  
**Critério:** Todos os 13 passam (acumulado: 108/164)

---

## Resultado dos Testes

```
Executado em: —
Total acumulado: 0/108 — SPRINT BLOQUEADA
```

---

## Notas de Execução

_(Preencher durante/após a execução)_

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint:
- [ ] Status Sprint 4 → ✅ Concluída
- [ ] Testes: `108 / 164`
- [ ] Listar hooks de Realtime criados
- [ ] Listar componentes de filtro criados
