# Sprint 7 — Crystal Reports Bridge

> **Status:** ⏳ Pendente  
> **Duração estimada:** 4 dias  
> **Pré-requisito:** Sprint 6 ✅  
> **Próxima:** Sprint 8 — PWA + Performance

---

## Objetivo da Sprint

Criar o micro-serviço `cr-service` (Node.js local) que funciona como bridge entre o frontend e o Crystal Reports, permitindo que o frontend solicite a geração de relatórios legados sem modificar o Crystal Reports existente.

---

## Arquitetura do CR Service

```
Frontend (Supabase Auth token)
    ↓ HTTP GET /relatorio?nome=vendas&dataInicio=...&dataFim=...
CR Service (Node.js local — porta 3001)
    ↓ valida token JWT via Supabase Admin SDK
    ↓ executa script .NET/PowerShell que abre Crystal Reports Runtime
    ↓ gera PDF em memória ou arquivo temp
    ← retorna PDF stream ou URL temporária

Crystal Reports Runtime (instalado no servidor)
    (NUNCA modificado)
```

---

## Estrutura do CR Service

```
cr-service/
├── src/
│   ├── index.ts          — servidor Fastify na porta 3001
│   ├── config.ts         — env vars + Zod validation
│   ├── auth.ts           — middleware valida JWT Supabase
│   ├── routes/
│   │   └── relatorios.ts — endpoints de geração
│   ├── generators/
│   │   ├── base.ts       — classe base para geradores
│   │   ├── vendas.ts     — relatório de vendas
│   │   ├── compras.ts    — relatório de compras
│   │   ├── estoque.ts    — relatório de estoque
│   │   ├── financeiro.ts — DRE, fluxo, receber, pagar
│   │   └── fiscal.ts     — relatório de notas fiscais
│   └── utils/
│       ├── pdf-cache.ts  — cache de PDFs por hash de parâmetros
│       └── cleanup.ts    — limpa arquivos temp > 1h
├── scripts/
│   └── gerar-relatorio.ps1  — script PowerShell que aciona CR Runtime
├── tests/
│   └── relatorios.test.ts
├── package.json
├── .env.example
└── README.md
```

---

## Checklist de Execução

### 1. Scaffolding
- [ ] Criar `cr-service/` com Node.js + TypeScript + Fastify
- [ ] Instalar dependências:
  - `fastify`, `@fastify/cors`, `@fastify/rate-limit`
  - `@supabase/supabase-js` — validação de token
  - `zod` — validação de parâmetros
  - `winston` — logging

### 2. Autenticação
- [ ] Criar `auth.ts` — middleware que:
  - Extrai Bearer token do header `Authorization`
  - Valida com `supabase.auth.getUser(token)`
  - Retorna 401 se inválido ou expirado
  - Retorna 403 se perfil não tem permissão para o relatório

### 3. Endpoint de Relatórios
```
GET /relatorios/:nome
  Query params: dataInicio, dataFim, filtro1, filtro2...
  Response: PDF stream (Content-Type: application/pdf)
  
  Relatórios disponíveis:
  - vendas-periodo
  - compras-periodo
  - estoque-atual
  - titulos-receber
  - titulos-pagar
  - dre-mensal
  - fluxo-caixa
  - notas-fiscais
```

### 4. Script PowerShell (CR Runtime)
- [ ] Criar `scripts/gerar-relatorio.ps1`
  - Aceita: nome do relatório, parâmetros como JSON
  - Carrega CR Runtime via COM interop
  - Abre arquivo `.rpt` correspondente
  - Seta parâmetros
  - Exporta para PDF no diretório temp
  - Retorna caminho do PDF
- [ ] Mapear arquivos `.rpt` com seus nomes amigáveis

### 5. Cache de PDFs
- [ ] Criar `pdf-cache.ts` — in-memory cache com TTL de 5 minutos
- [ ] Chave: hash MD5 dos parâmetros da request
- [ ] Se cache hit: retorna PDF salvo sem re-executar CR
- [ ] Criar job de limpeza de arquivos temp > 1h

### 6. Frontend Integration
- [ ] Criar `frontend/src/hooks/useRelatorio.ts`
  - Solicita PDF do cr-service com token do usuário
  - Abre em nova aba ou baixa como arquivo
- [ ] Criar `frontend/src/components/ui/BotaoRelatorio.tsx`
  - Botão com loading state e ícone PDF
  - Aparece nos módulos relevantes

---

## Testes da Sprint (10 testes obrigatórios)

### Arquivo: `cr-service/tests/relatorios.test.ts`
```typescript
// TESTE 1: Request sem token retorna 401
test('GET /relatorios/vendas sem Authorization retorna 401')

// TESTE 2: Token inválido retorna 401
test('GET /relatorios/vendas com token expirado retorna 401')

// TESTE 3: Parâmetros inválidos retornam 400
test('GET /relatorios sem dataInicio retorna 400 com mensagem clara')

// TESTE 4: Cache retorna PDF sem re-executar script
test('segunda request com mesmos params retorna do cache em <50ms')

// TESTE 5: Relatório desconhecido retorna 404
test('GET /relatorios/inexistente retorna 404')
```

### Arquivo: `frontend/src/test/hooks/useRelatorio.test.ts`
```typescript
// TESTE 6: Hook solicita PDF com token correto
test('useRelatorio envia Authorization header com token do usuário')

// TESTE 7: Hook trata erro 401 com redirect para login
test('useRelatorio redireciona para /login ao receber 401 do cr-service')

// TESTE 8: Hook trata erro 500 com toast de erro
test('useRelatorio exibe toast de erro ao falhar a geração do PDF')
```

### Arquivo: `frontend/src/test/components/BotaoRelatorio.test.tsx`
```typescript
// TESTE 9: BotaoRelatorio mostra loading durante geração
test('BotaoRelatorio exibe spinner durante chamada ao useRelatorio')

// TESTE 10: BotaoRelatorio abre PDF em nova aba ao concluir
test('BotaoRelatorio chama window.open com URL do PDF ao sucesso')
```

**Total: 10 testes**  
**Critério:** Todos passam (acumulado: 150/164)

---

## Variáveis de Ambiente

```env
# cr-service/.env
PORT=3001
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CR_REPORTS_PATH=C:\CrystalReports\Relatorios
CR_TEMP_PATH=C:\CrystalReports\Temp
CR_CACHE_TTL_MINUTES=5
LOG_FILE=C:\ERPView\logs\cr-service.log
```

---

## Resultado dos Testes

```
Executado em: —
Total acumulado: 0/150 — SPRINT BLOQUEADA
```

---

## Notas de Execução

_(Preencher durante/após a execução)_  
⚠️ **Importante:** O Crystal Reports Runtime deve estar instalado no servidor Windows. Os testes unitários mockam o script PowerShell.

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint:
- [ ] Status Sprint 7 → ✅ Concluída
- [ ] Testes: `150 / 164`
- [ ] Adicionar `cr-service/` à estrutura de arquivos
- [ ] Listar relatórios disponíveis
