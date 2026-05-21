# Sprint 1 — Types Supabase + Auth

> **Status:** ✅ Concluída
> **Duração estimada:** 3 dias
> **Pré-requisito:** Sprint 0 ✅ (todos os 5 testes passando)
> **Próxima:** Sprint 2 — Hooks de Dados

---

## Objetivo da Sprint

Gerar tipos TypeScript sincronizados com o schema do Supabase, implementar o sistema de autenticação e controle básico de perfil de usuário, e garantir que o `authStore` funcione corretamente com RLS ativo.

---

## Checklist de Execução

### 1. Tipos Supabase

- [X] Executar `supabase gen types typescript` para gerar `supabase-types.ts`
- [X] Copiar tipos gerados para `frontend/src/types/supabase.ts`
- [X] Criar `frontend/src/types/index.ts` unificado exportando tudo
- [X] Remover tipos manuais antigos que conflitem com os gerados
- [X] Rodar `tsc --noEmit` — zero erros

### 2. Auth Store Refatorado

- [X] Refatorar `authStore.ts` usando os tipos gerados
- [X] Implementar função `carregarPerfil()` — busca `perfis_usuario` após login
- [X] Implementar `logout()` limpo (clear store + supabase.auth.signOut)
- [X] Implementar `onAuthStateChange` listener que atualiza store
- [X] Adicionar campo `perfil` no store (role, modulos_permitidos, cargo)

### 3. Página de Login

- [X] Revisar `Login.tsx` — garantir feedback de erro claro (Sonner toast)
- [X] Adicionar loading state no botão de login
- [X] Tratar erros específicos: email inválido, senha errada, conta inativa
- [X] Redirect automático após login bem-sucedido

### 4. Hook usePerfil

- [X] Criar `frontend/src/hooks/usePerfil.ts`
- [X] Retorna: `{ perfil, carregando, erro }`
- [X] Usa React Query com `staleTime: Infinity` (perfil não muda durante sessão)

---

## Testes da Sprint (9 testes obrigatórios)

### Arquivo: `src/test/store/authStore.test.ts`

```typescript
// TESTE 1: Estado inicial do authStore
test('authStore inicia com usuário nulo e não autenticado')

// TESTE 2: Login bem-sucedido atualiza store
test('login bem-sucedido popula user e perfil no store')

// TESTE 3: Login com credenciais erradas mantém estado inicial
test('login com senha errada mantém usuário como nulo')

// TESTE 4: Logout limpa o store completamente
test('logout reseta user, perfil e isAuthenticated para null/false')

// TESTE 5: onAuthStateChange atualiza store ao detectar sessão
test('listener de auth atualiza store quando sessão existe no cookie')
```

### Arquivo: `src/test/hooks/usePerfil.test.ts`

```typescript
// TESTE 6: Retorna perfil quando usuário autenticado
test('usePerfil retorna dados do perfil para usuário logado')

// TESTE 7: Retorna null quando não autenticado
test('usePerfil retorna null quando sem sessão activa')

// TESTE 8: Caching funciona (não refaz query na mesma sessão)
test('usePerfil não faz segunda chamada ao Supabase se já carregou')
```

### Arquivo: `src/test/pages/Login.test.tsx`

```typescript
// TESTE 9: Formulário de login renderiza corretamente
test('Login renderiza campos email, senha e botão entrar')
```

**Critério de passagem:** Todos os 9 testes passam

---

## Arquivos Criados/Modificados

| Arquivo                                        | Ação         | Status |
| ---------------------------------------------- | -------------- | ------ |
| `frontend/src/types/supabase.ts`             | Criar (gerado) | ✅     |
| `frontend/src/types/index.ts`                | Atualizar      | ✅     |
| `frontend/src/store/authStore.ts`            | Refatorar      | ✅     |
| `frontend/src/hooks/usePerfil.ts`            | Criar          | ✅     |
| `frontend/src/pages/Login.tsx`               | Atualizar      | ✅     |
| `frontend/src/test/store/authStore.test.ts`  | Criar          | ✅     |
| `frontend/src/test/hooks/usePerfil.test.tsx` | Criar          | ✅     |
| `frontend/src/test/pages/Login.test.tsx`     | Criar          | ✅     |

---

## Resultado dos Testes

```
Executado em: 2026-05-21
Comando: npm run test

PASS / FAIL   Arquivo                              Testes
PASS          src/test/store/authStore.test.ts      5/5
PASS          src/test/hooks/usePerfil.test.tsx     3/3
PASS          src/test/pages/Login.test.tsx         1/1

Total: 9 passou — SPRINT CONCLUÍDA
```

---

## Notas de Execução

_(Preencher durante/após a execução)_

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint, atualizar em `CONTEXTO.md`:

- [ ] Status de Sprint 1 → ✅ Concluída
- [ ] Adicionar data de conclusão
- [ ] Atualizar contagem de testes: `14 / 164`
- [ ] Atualizar arquivos criados na estrutura
- [ ] Registrar versão dos tipos gerados (data do gen)
