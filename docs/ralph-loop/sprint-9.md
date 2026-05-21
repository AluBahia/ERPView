# Sprint 9 — Polish + Deploy

> **Status:** ⏳ Pendente  
> **Duração estimada:** 3 dias  
> **Pré-requisito:** Sprint 8 ✅ (todos os 157 testes passando)  
> **Próxima:** 🎉 PROJETO CONCLUÍDO

---

## Objetivo da Sprint

Polimento final da UI/UX, configuração do deploy em produção (Vercel), e validação completa do sistema com todos os 164 testes passando.

---

## Checklist de Execução

### 1. Polish de UI/UX
- [ ] Revisar responsividade de todas as 18 páginas em mobile (375px) e desktop (1440px)
- [ ] Garantir touch targets ≥ 44px em todos os elementos interativos
- [ ] Revisar contraste de cores — WCAG AA compliance
- [ ] Adicionar transitions suaves entre rotas (Framer Motion)
- [ ] Revisar tipografia — consistência de tamanhos e pesos
- [ ] Adicionar tooltips em dados que precisam de contexto
- [ ] Revisar empty states — mensagens motivacionais e CTAs claros
- [ ] Revisar error states — mensagens amigáveis, botão retry visível

### 2. Acessibilidade
- [ ] Auditar ARIA labels nos componentes interativos
- [ ] Garantir navegação por teclado em toda a aplicação
- [ ] Adicionar `sr-only` labels onde necessário
- [ ] Verificar focus visible em todos os elementos
- [ ] Testar com leitor de tela (NVDA/VoiceOver básico)

### 3. Internacionalização (pt-BR)
- [ ] Varredura final — zero string em inglês na UI
- [ ] Verificar formatação de datas (dd/MM/yyyy)
- [ ] Verificar formatação de moeda (R$ 1.234,56)
- [ ] Verificar formatação de números (1.000.000)
- [ ] Verificar mensagens de erro — todas em pt-BR

### 4. Deploy Vercel
- [ ] Configurar `vercel.json` com redirects SPA
- [ ] Configurar variáveis de ambiente no Vercel dashboard
- [ ] Configurar domínio customizado (se houver)
- [ ] Habilitar Vercel Analytics
- [ ] Configurar preview deployments para PRs
- [ ] Deploy de produção + smoke test

### 5. Documentação Final
- [ ] Atualizar `README.md` do projeto com:
  - Descrição do sistema
  - Stack tecnológica
  - Instruções de instalação
  - Configuração de variáveis de ambiente
  - Como instalar o Sync Agent no servidor
  - Como instalar o CR Service
- [ ] Criar `docs/MANUAL-USUARIO.md` com instruções básicas
- [ ] Criar `docs/INSTALACAO-SERVIDOR.md` (sync-agent + cr-service)

---

## Testes da Sprint (7 testes obrigatórios)

### Arquivo: `src/test/e2e/fluxo-principal.test.ts`
```typescript
// TESTE 1: Login → Dashboard → Vendas fluxo completo
test('usuário faz login e navega até a página de Vendas com sucesso')

// TESTE 2: Filtros aplicados persistem após navegação
test('filtro de data aplicado em Vendas persiste ao voltar')

// TESTE 3: Logout limpa sessão completamente
test('logout redireciona para /login e dados do usuário são limpos')
```

### Arquivo: `src/test/deploy/build.test.ts`
```typescript
// TESTE 4: Build de produção sem erros TypeScript
test('tsc --noEmit retorna código 0 sem erros')

// TESTE 5: Bundle size dentro do limite
test('bundle inicial (index.js) < 200KB gzipped')

// TESTE 6: Todas as rotas têm chunk próprio
test('18 módulos têm chunks lazy separados no build')
```

### Arquivo: `src/test/a11y/accessibility.test.ts`
```typescript
// TESTE 7: Dashboard passa validação axe-core básica
test('Dashboard não tem violações de acessibilidade críticas (axe-core)')
```

**Total: 7 testes**  
**Critério:** Todos os 7 passam — **TOTAL: 164/164 testes passando**

---

## Resultado dos Testes

```
Executado em: —

RESUMO FINAL:
  Sprint 0:  5/5   ✅
  Sprint 1:  9/9   ✅
  Sprint 2: 45/45  ✅
  Sprint 3: 36/36  ✅
  Sprint 4: 13/13  ✅
  Sprint 5: 25/25  ✅
  Sprint 6:  7/7   ✅
  Sprint 7: 10/10  ✅
  Sprint 8:  7/7   ✅
  Sprint 9:  7/7   ✅
  ─────────────────
  TOTAL:  164/164  🎉
```

---

## Deploy

```
URL de Produção: —
URL do Preview: —
Vercel Project: —
Data de Deploy: —
```

---

## Notas de Execução

_(Preencher durante/após a execução)_

---

## Atualização final do CONTEXTO.md

Ao concluir esta sprint:
- [ ] Status Sprint 9 → ✅ Concluída
- [ ] **Testes: `164 / 164` ✅**
- [ ] **Sprints concluídas: `10 / 10` ✅**
- [ ] Registrar URL de produção
- [ ] Registrar data de conclusão do projeto
- [ ] Adicionar nota: "🎉 PROJETO CONCLUÍDO — ERPView em produção"
