# Sprint 6 — Controle de Acesso por Perfil

> **Status:** ⏳ Pendente  
> **Duração estimada:** 2 dias  
> **Pré-requisito:** Sprint 4 ✅ e Sprint 5 ✅  
> **Próxima:** Sprint 7 — Crystal Reports

---

## Objetivo da Sprint

Implementar controle de acesso baseado em perfis (RBAC) usando a tabela `perfis_usuario` no Supabase e RLS policies, garantindo que cada usuário veja apenas os módulos que seu perfil permite.

---

## Perfis de Acesso

| Role | Módulos | Acesso |
|------|---------|--------|
| `admin` | Todos | Leitura total |
| `gerente` | Vendas, Financeiro, Produção, RH | Leitura total |
| `operador_vendas` | Vendas, Clientes, Estoque, Produtos | Leitura |
| `operador_financeiro` | Receber, Pagar, Fluxo Caixa, DRE, Custos | Leitura |
| `operador_producao` | Produção, Qualidade, Expedição, Manutenção | Leitura |
| `visualizador` | Dashboard apenas | Leitura restrita |

---

## Checklist de Execução

### 1. RLS Policies por Perfil
- [ ] Criar policy: usuário vê somente dados autorizados pelo seu perfil
- [ ] Criar policy: `perfis_usuario` — usuário lê apenas seu próprio perfil
- [ ] Criar policy: `log_auditoria` — somente admin lê

### 2. ProtectedRoute por Módulo
- [ ] Criar `components/auth/ProtectedRoute.tsx`
  - Props: `requiredRole[]`, `moduloRequerido`
  - Redireciona para `/acesso-negado` se não autorizado
- [ ] Criar `pages/AcessoNegado.tsx` — página 403 amigável
- [ ] Atualizar `router.tsx` envolvendo cada módulo com `ProtectedRoute`

### 3. Sidebar Dinâmico
- [ ] Atualizar `Sidebar.tsx` para filtrar menu com base em `perfil.modulos_permitidos`
- [ ] Ocultar links de módulos não autorizados (não só desabilitar)
- [ ] Mostrar badge do cargo do usuário no sidebar

### 4. Hook usePermissao
- [ ] Criar `hooks/usePermissao.ts`
  - `temPermissao(modulo: string): boolean`
  - `isAdmin(): boolean`
  - `isGerente(): boolean`

---

## Testes da Sprint (7 testes obrigatórios)

### Arquivo: `src/test/auth/ProtectedRoute.test.tsx`
```typescript
// TESTE 1: Acesso permitido renderiza children
test('ProtectedRoute renderiza conteúdo para usuário com role correto')

// TESTE 2: Acesso negado redireciona
test('ProtectedRoute redireciona para /acesso-negado sem permissão')

// TESTE 3: Usuário não autenticado redireciona para login
test('ProtectedRoute redireciona para /login se não autenticado')
```

### Arquivo: `src/test/hooks/usePermissao.test.ts`
```typescript
// TESTE 4: temPermissao retorna true para módulo permitido
test('temPermissao("vendas") retorna true para operador_vendas')

// TESTE 5: temPermissao retorna false para módulo não permitido
test('temPermissao("financeiro") retorna false para operador_vendas')

// TESTE 6: admin tem acesso a todos os módulos
test('isAdmin() retorna true e temPermissao() é sempre true para admin')
```

### Arquivo: `src/test/components/Sidebar.test.tsx`
```typescript
// TESTE 7: Sidebar mostra apenas módulos do perfil
test('Sidebar renderiza somente links de módulos autorizados do perfil')
```

**Total: 7 testes**  
**Critério:** Todos passam (acumulado: 140/164)

---

## Resultado dos Testes

```
Executado em: —
Total acumulado: 0/140 — SPRINT BLOQUEADA
```

---

## Notas de Execução

_(Preencher durante/após a execução)_

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint:
- [ ] Status Sprint 6 → ✅ Concluída
- [ ] Testes: `140 / 164`
- [ ] Listar perfis de acesso configurados
- [ ] Documentar RLS policies criadas
