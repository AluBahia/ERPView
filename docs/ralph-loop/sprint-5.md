# Sprint 5 — Sync Agent (SQL Server → Supabase)

> **Status:** ⏳ Pendente  
> **Duração estimada:** 5 dias  
> **Pré-requisito:** Sprint 1 ✅ (pode rodar em paralelo com Sprints 2-4)  
> **Próxima:** Sprint 6 — Controle de Acesso

---

## Objetivo da Sprint

Criar o `sync-agent` — um serviço Node.js que roda no servidor Windows local, conecta ao SQL Server 2008 R2 (somente leitura), e sincroniza os dados incrementalmente para o Supabase na nuvem.

---

## Estrutura do Sync Agent

```
sync-agent/
├── src/
│   ├── index.ts              — entry point + scheduler
│   ├── config.ts             — configurações (env vars)
│   ├── logger.ts             — Winston logger
│   ├── db/
│   │   ├── sqlserver.ts      — conexão MSSQL (somente leitura)
│   │   └── supabase.ts       — cliente Supabase (service role)
│   ├── sync/
│   │   ├── orchestrator.ts   — coordena todos os syncs
│   │   ├── clientes.ts       — sync clientes
│   │   ├── produtos.ts       — sync produtos
│   │   ├── pedidos-venda.ts  — sync pedidos de venda
│   │   ├── estoque.ts        — sync estoque
│   │   ├── titulos.ts        — sync títulos receber/pagar
│   │   ├── fornecedores.ts   — sync fornecedores
│   │   ├── producao.ts       — sync ordens produção
│   │   ├── expedicao.ts      — sync expedição
│   │   ├── manutencao.ts     — sync manutenção
│   │   ├── notas-fiscais.ts  — sync NFs
│   │   ├── rh.ts             — sync colaboradores
│   │   └── patrimonio.ts     — sync bens patrimoniais
│   └── utils/
│       ├── delta.ts          — detecção de mudanças (upsert strategy)
│       └── retry.ts          — retry com exponential backoff
├── tests/
│   └── sync/
│       ├── clientes.test.ts
│       ├── delta.test.ts
│       └── orchestrator.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── install-service.ts        — instala como serviço Windows (node-windows)
```

---

## Checklist de Execução

### 1. Scaffolding
- [ ] Criar `sync-agent/` com `npm init` + TypeScript
- [ ] Instalar dependências:
  - `mssql` — driver SQL Server
  - `@supabase/supabase-js` — client Supabase  
  - `winston` — logging estruturado
  - `node-windows` — serviço Windows
  - `node-schedule` — agendamento (a cada 5 min)
  - `zod` — validação de env vars
- [ ] Criar `config.ts` com validação de env vars via Zod

### 2. Conexão SQL Server (somente leitura)
- [ ] Criar `db/sqlserver.ts` com pool de conexão `mssql`
- [ ] Configurar `readOnly: true` na connection string
- [ ] Implementar health check (`SELECT 1`)
- [ ] Criar `.env.example` com variáveis necessárias

### 3. Estratégia de Sync (Delta/Incremental)
- [ ] Criar `utils/delta.ts`:
  - Estratégia A: por `data_alteracao` (timestamp de modificação)
  - Estratégia B: por hash de registro (para tabelas sem timestamp)
  - Retorna: `{ inseridos, atualizados, deletados }`
- [ ] Implementar upsert no Supabase com `onConflict`

### 4. Sync de Cada Módulo
- [ ] `sync/clientes.ts` — query SQL Server → upsert Supabase
- [ ] `sync/produtos.ts`
- [ ] `sync/pedidos-venda.ts` (com `itens_pedido`)
- [ ] `sync/estoque.ts`
- [ ] `sync/titulos.ts` (receber e pagar juntos)
- [ ] `sync/fornecedores.ts`
- [ ] `sync/producao.ts`
- [ ] `sync/expedicao.ts`
- [ ] `sync/manutencao.ts`
- [ ] `sync/notas-fiscais.ts`
- [ ] `sync/rh.ts`
- [ ] `sync/patrimonio.ts`

### 5. Orchestrator
- [ ] Criar `sync/orchestrator.ts`:
  - Roda todos os syncs em sequência com await
  - Log início/fim/duração de cada sync
  - Captura erros individuais sem interromper outros
  - Grava resultado em tabela `log_auditoria` no Supabase

### 6. Scheduler
- [ ] Criar `index.ts` com `node-schedule`:
  - Sync completo: a cada 5 minutos
  - Sync crítico (financeiro): a cada 1 minuto
  - Log de heartbeat a cada 30 segundos

### 7. Instalação como Serviço Windows
- [ ] Criar `install-service.ts` usando `node-windows`
- [ ] Criar `README-servico.md` com instruções de instalação

---

## Testes da Sprint (25 testes obrigatórios)

### Arquivo: `tests/sync/delta.test.ts`
```typescript
// TESTE 1: detecta registro novo (sem match no Supabase)
test('delta identifica registro novo para inserção')

// TESTE 2: detecta registro modificado
test('delta identifica registro modificado para atualização')

// TESTE 3: não sincroniza registro não modificado
test('delta ignora registro sem alterações')

// TESTE 4: retry funciona após falha temporária
test('retry tenta 3x com backoff antes de lançar erro final')

// TESTE 5: backoff exponencial aumenta tempo entre tentativas
test('backoff aumenta tempo: 1s, 2s, 4s entre tentativas')
```

### Arquivo: `tests/sync/clientes.test.ts`
```typescript
// TESTE 6: query SQL Server retorna dados no formato esperado
test('query clientes retorna campos obrigatórios: id, nome, cnpj, cidade')

// TESTE 7: upsert no Supabase com clientes novos
test('upsert insere clientes novos no Supabase')

// TESTE 8: upsert atualiza clientes existentes
test('upsert atualiza clientes modificados sem duplicar')

// TESTE 9: clientes deletados no ERP são marcados como inativos
test('soft delete: clientes removidos no ERP ficam com ativo=false')

// TESTE 10: erros de conexão são logados e não propagam
test('erro na query SQL Server é capturado e logado, sync continua')
```

### Arquivo: `tests/sync/orchestrator.test.ts`
```typescript
// TESTE 11: orchestrator executa todos os syncs
test('orchestrator chama sync de cada módulo em sequência')

// TESTE 12: falha de um módulo não bloqueia os outros
test('erro no sync de clientes não impede sync de produtos')

// TESTE 13: resultado é gravado no log_auditoria
test('orchestrator grava resultado em log_auditoria no Supabase')

// TESTE 14: duração de cada sync é registrada
test('log inclui duração em ms de cada sync individual')

// TESTE 15: heartbeat é enviado a cada ciclo
test('orchestrator grava heartbeat no Supabase após cada ciclo')
```

### Testes adicionais por módulo (10 testes — 1 por módulo extra):
- `tests/sync/produtos.test.ts` (2)
- `tests/sync/pedidos.test.ts` (2)
- `tests/sync/estoque.test.ts` (2)
- `tests/sync/titulos.test.ts` (2)
- `tests/sync/fiscal.test.ts` (2)

**Total: 25 testes**  
**Critério:** Todos passam (acumulado: 133/164)

---

## Variáveis de Ambiente Necessárias

```env
# SQL Server (somente leitura)
SQLSERVER_HOST=servidor-local
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=ERP_PRODUCAO
SQLSERVER_USER=erp_readonly
SQLSERVER_PASSWORD=...
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true

# Supabase (service role — NUNCA no frontend)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...

# Sync config
SYNC_INTERVAL_MINUTES=5
SYNC_CRITICAL_INTERVAL_MINUTES=1
LOG_LEVEL=info
LOG_FILE=C:\ERPView\logs\sync-agent.log
```

---

## Resultado dos Testes

```
Executado em: —
Total acumulado: 0/133 — SPRINT BLOQUEADA
```

---

## Notas de Execução

_(Preencher durante/após a execução)_  
⚠️ **Importante:** A conexão com o SQL Server real só pode ser testada no servidor local. Os testes unitários devem usar mocks do `mssql`.

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint:
- [ ] Status Sprint 5 → ✅ Concluída
- [ ] Testes: `133 / 164`
- [ ] Adicionar `sync-agent/` à estrutura de arquivos
- [ ] Registrar variáveis de ambiente configuradas
