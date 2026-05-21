# Sprint 2 — Hooks de Dados (14 módulos)

> **Status:** ✅ Concluída  
> **Duração estimada:** 5 dias  
> **Pré-requisito:** Sprint 1 ✅ (9 testes passando)  
> **Próxima:** Sprint 3 — Páginas Reais  
> **Conclusão:** 2026-05-21

---

## Objetivo da Sprint

Criar os 14 hooks de dados customizados usando TanStack React Query + Supabase, um para cada módulo do ERP. Cada hook encapsula a query, transformação e tipagem dos dados vindos do Supabase.

---

## Hooks a Criar

| Hook | Tabela Supabase | Arquivo |
|------|----------------|---------|
| `useVendas` | `pedidos_venda` | `hooks/useVendas.ts` |
| `useClientes` | `clientes` | `hooks/useClientes.ts` |
| `useCompras` | `pedidos_compra` | `hooks/useCompras.ts` |
| `useFornecedores` | `fornecedores` | `hooks/useFornecedores.ts` |
| `useEstoque` | `itens_estoque` | `hooks/useEstoque.ts` |
| `useProdutos` | `produtos` | `hooks/useProdutos.ts` |
| `useProducao` | `ordens_producao` | `hooks/useProducao.ts` |
| `useQualidade` | `ncr` | `hooks/useQualidade.ts` |
| `useExpedicao` | `pedidos_expedicao` | `hooks/useExpedicao.ts` |
| `useManutencao` | `ordens_servico` | `hooks/useManutencao.ts` |
| `useReceber` | `titulos_receber` | `hooks/useReceber.ts` |
| `usePagar` | `titulos_pagar` | `hooks/usePagar.ts` |
| `useFiscal` | `notas_fiscais` | `hooks/useFiscal.ts` |
| `usePatrimonio` | `bens_patrimoniais` | `hooks/usePatrimonio.ts` |

### Hooks financeiros (tabelas novas do schema v2)
| Hook | Tabela | Arquivo |
|------|--------|---------|
| `useFluxoCaixa` | `fluxo_caixa` | `hooks/useFluxoCaixa.ts` |
| `useDRE` | `dre` | `hooks/useDRE.ts` |
| `useCustos` | `custos` | `hooks/useCustos.ts` |
| `useRH` | `rh_colaboradores` | `hooks/useRH.ts` |

---

## Padrão de Implementação de Cada Hook

```typescript
// Exemplo: useVendas.ts
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PedidoVenda } from '@/types'

interface FiltrosVendas {
  dataInicio?: string
  dataFim?: string
  status?: string
  clienteId?: string
}

export function useVendas(filtros: FiltrosVendas = {}) {
  return useQuery({
    queryKey: ['vendas', filtros],
    queryFn: async () => {
      let query = supabase
        .from('pedidos_venda')
        .select('*, clientes(nome, cidade)')
        .order('data_emissao', { ascending: false })

      if (filtros.dataInicio) query = query.gte('data_emissao', filtros.dataInicio)
      if (filtros.dataFim) query = query.lte('data_emissao', filtros.dataFim)
      if (filtros.status) query = query.eq('status', filtros.status)
      if (filtros.clienteId) query = query.eq('cliente_id', filtros.clienteId)

      const { data, error } = await query
      if (error) throw new Error(`Erro ao carregar vendas: ${error.message}`)
      return data as PedidoVenda[]
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}
```

---

## Checklist de Execução

- [x] Criar `useVendas.ts` com filtros: data, status, cliente
- [x] Criar `useClientes.ts` com filtros: cidade, estado, ativo
- [x] Criar `useCompras.ts` com filtros: data, fornecedor, status
- [x] Criar `useFornecedores.ts` com filtros: ativo, UF
- [x] Criar `useEstoque.ts` com filtros: produto, almoxarifado, abaixo_minimo
- [x] Criar `useProdutos.ts` com filtros: categoria, ativo
- [x] Criar `useProducao.ts` com filtros: data, status, linha
- [x] Criar `useQualidade.ts` com filtros: data, tipo, status
- [x] Criar `useExpedicao.ts` com filtros: data, transportadora, status
- [x] Criar `useManutencao.ts` com filtros: data, tipo, status, equipamento
- [x] Criar `useReceber.ts` com filtros: vencimento, status, cliente
- [x] Criar `usePagar.ts` com filtros: vencimento, status, fornecedor
- [x] Criar `useFiscal.ts` com filtros: data, tipo_nf, CFOP
- [x] Criar `usePatrimonio.ts` com filtros: categoria, localização
- [x] Criar `useFluxoCaixa.ts` com filtros: mês/ano, tipo
- [x] Criar `useDRE.ts` com filtros: período (mês/ano)
- [x] Criar `useCustos.ts` com filtros: período, linha, produto
- [x] Criar `useRH.ts` com filtros: departamento, cargo, ativo
- [x] Atualizar `useKPIs.ts` para usar dados reais das tabelas
- [x] Rodar `tsc --noEmit` — zero erros

---

## Testes da Sprint (45 testes obrigatórios)

### Padrão: 2-3 testes por hook

```typescript
// Para cada hook, testar:
// 1. Retorna dados com sucesso quando Supabase responde
// 2. Retorna erro quando Supabase falha
// 3. Aplica filtros corretamente (apenas quando há filtros)
```

### Arquivo: `src/test/hooks/useVendas.test.ts` (3 testes)
- Retorna lista de vendas com join de clientes
- Filtra por data quando filtros.dataInicio/dataFim fornecidos
- Propaga erro quando Supabase retorna error

### Arquivos similares para cada hook (2-3 testes cada):
- `useClientes.test.ts` (3)
- `useCompras.test.ts` (3)
- `useFornecedores.test.ts` (2)
- `useEstoque.test.ts` (3)
- `useProdutos.test.ts` (2)
- `useProducao.test.ts` (3)
- `useQualidade.test.ts` (2)
- `useExpedicao.test.ts` (2)
- `useManutencao.test.ts` (3)
- `useReceber.test.ts` (3)
- `usePagar.test.ts` (3)
- `useFiscal.test.ts` (2)
- `usePatrimonio.test.ts` (2)
- `useFluxoCaixa.test.ts` (3)
- `useDRE.test.ts` (2)
- `useCustos.test.ts` (2)
- `useRH.test.ts` (2)
- `useKPIs.test.ts` (3 — atualizado para dados reais)

**Total: 48 testes** (45 hooks + 3 useKPIs atualizado)  
**Critério:** Todos os 48 passam ✅

---

## Resultado dos Testes

```
Executado em: 2026-05-21
Comando: npx vitest run --reporter=verbose

PASS   23 test files
Total: 62 passou, 0 falhou — SPRINT CONCLUÍDA
```

---

## Notas de Execução

- 4 bugs corrigidos no useKPIs.ts (fallback para null, tabela rh→rh_colaboradores, pedidos_compra como missing table, transformToKPIs implementado para todos os 18 módulos)
- 18 hooks de dados criados com filtros e tipagem via Database types
- Tabela `pedidos_compra` ainda não existe no schema — hook usa `as any` para contornar TypeScript até criação da tabela
- Todos os hooks seguem padrão useQuery + supabase + throw error + QUERY_STALE_TIME

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint:
- [x] Status Sprint 2 → ✅ Concluída
- [x] Testes: `62 / 164`
- [x] Listar todos os hooks criados na estrutura de arquivos
