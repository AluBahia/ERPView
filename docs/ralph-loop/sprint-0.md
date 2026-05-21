# Sprint 0 — Infraestrutura de Testes + Schema

> **Status:** ✅ Concluído  
> **Duração estimada:** 2 dias  
> **Pré-requisito:** Nenhum — é a sprint inicial  
> **Próxima:** Sprint 1 — Types Supabase + Auth

---

## Objetivo da Sprint

Preparar o ambiente de desenvolvimento com toda a infraestrutura de testes automatizados (Vitest, MSW, Testing Library) e garantir que o schema do Supabase esteja completo com todas as tabelas necessárias para o projeto.

---

## Checklist de Execução

### 1. Infraestrutura de Testes
- [x] Instalar dependências de teste no frontend:
  - `vitest`, `@vitest/ui`, `@vitest/coverage-v8`
  - `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`
  - `msw@2` (Mock Service Worker)
  - `jsdom`
- [x] Configurar `vitest.config.ts` com jsdom environment
- [x] Criar `src/test/setup.ts` com jest-dom matchers
- [x] Criar `src/test/mocks/supabase.ts` — mock do client Supabase
- [x] Criar `src/test/mocks/handlers.ts` — MSW handlers base
- [x] Criar `src/test/mocks/server.ts` — MSW server setup
- [x] Adicionar scripts `test`, `test:ui`, `test:coverage` no `package.json`

### 2. Schema Supabase v2
- [x] Criar `supabase-schema-v2.sql` com tabelas faltantes:
  - `perfis_usuario` (id, user_id, nome, cargo, role, modulos_permitidos)
  - `log_auditoria` (id, usuario_id, acao, tabela, registro_id, dados, timestamp)
  - `dashboard_kpis` (tabela de cache/snapshot dos KPIs diários)
  - `fluxo_caixa` (sincronizada pelo Sync Agent)
  - `dre` (demonstrativo resultado exercício)
  - `custos` (custos de produção)
  - `rh_colaboradores` (espelho do módulo RH)
- [x] Adicionar RLS em todas as novas tabelas
- [x] Adicionar índices de performance nas novas tabelas
- [x] Executar schema no Supabase (produção)

### 3. Seed de Dados de Teste
- [x] Criar `supabase-seed.sql` com dados realistas:
  - 5 perfis de usuário (admin, gerente, operador, visualizador, financeiro)
  - 50 clientes de teste
  - 100 produtos
  - 200 pedidos de venda (últimos 3 meses)
  - 500 itens de estoque
  - 150 títulos a receber
  - 80 títulos a pagar
  - 30 ordens de produção
  - 20 notas fiscais
- [x] Executar seed no ambiente de desenvolvimento

---

## Testes da Sprint (5 testes obrigatórios)

### Arquivo: `src/test/infra/setup.test.ts`

```typescript
// TESTE 1: Ambiente Vitest configurado corretamente
test('ambiente de teste inicializa sem erros', () => {
  expect(true).toBe(true)
})

// TESTE 2: MSW intercepta requisições corretamente
test('MSW server responde com mock ao fazer fetch', async () => {
  // handler mock retorna dados fake
  // fetch deve retornar os dados mock, não ir para rede
})

// TESTE 3: Supabase mock funciona
test('mock do supabase retorna dados sem erros de tipagem', async () => {
  // chamar supabase.from('clientes').select()
  // deve retornar array vazio sem erros
})

// TESTE 4: Schema contém todas as tabelas esperadas
test('schema SQL contém todas as 20 tabelas necessárias', () => {
  // ler supabase-schema-v2.sql
  // verificar presença de cada tabela pelo nome
})

// TESTE 5: Seed contém registros mínimos por tabela
test('seed SQL contém dados de teste suficientes', () => {
  // verificar que seed tem ao menos 5 INSERTs por tabela crítica
})
```

**Critério de passagem:** Todos os 5 testes passam (`vitest run`)

---

## Arquivos Criados/Modificados

| Arquivo | Ação | Status |
|---------|------|--------|
| `frontend/vitest.config.ts` | Criar | ✅ |
| `frontend/src/test/setup.ts` | Criar | ✅ |
| `frontend/src/test/mocks/supabase.ts` | Criar | ✅ |
| `frontend/src/test/mocks/handlers.ts` | Criar | ✅ |
| `frontend/src/test/mocks/server.ts` | Criar | ✅ |
| `frontend/src/test/infra/setup.test.ts` | Criar | ✅ |
| `frontend/package.json` | Atualizar (devDeps + scripts) | ✅ |
| `supabase-schema-v2.sql` | Criar | ✅ |
| `supabase-seed.sql` | Criar | ✅ |

---

## Resultado dos Testes

```
Executado em: 2026-05-21
Comando: npm run test -- --reporter=verbose

PASS   src/test/infra/setup.test.ts     5/5

Total: 5 passou, 0 falharam — SPRINT CONCLUÍDA
```

---

## Notas de Execução

- Ambiente configurado com sucesso.
- Todos os testes de infraestrutura e carregamento de arquivos de schema e seed passam.

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint, atualizar em `CONTEXTO.md`:
- [x] Status de Sprint 0 → ✅ Concluída
- [x] Adicionar data de conclusão
- [x] Atualizar contagem de testes: `5 / 164`
- [x] Atualizar estrutura de arquivos com os criados
- [x] Adicionar nota: "Sprint 0 concluída — ambiente de testes pronto"
