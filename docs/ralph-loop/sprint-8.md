# Sprint 8 — PWA + Performance

> **Status:** ⏳ Pendente  
> **Duração estimada:** 3 dias  
> **Pré-requisito:** Sprint 7 ✅  
> **Próxima:** Sprint 9 — Polish + Deploy

---

## Objetivo da Sprint

Configurar o PWA (Progressive Web App) com Service Worker, garantir que o Lighthouse score fique acima de 90 em todas as categorias, e implementar as otimizações de performance necessárias.

---

## Checklist de Execução

### 1. PWA (vite-plugin-pwa)
- [ ] Instalar `vite-plugin-pwa` + `workbox-window`
- [ ] Configurar `vite.config.ts`:
  - manifest com nome, ícones, theme_color, display
  - workbox strategy: `NetworkFirst` para API, `CacheFirst` para assets
  - precache de assets críticos
- [ ] Criar `public/manifest.json` completo
- [ ] Criar ícones PWA em todos os tamanhos (192x192, 512x512, maskable)
- [ ] Criar `public/offline.html` — página fallback offline
- [ ] Criar `src/components/pwa/InstallPrompt.tsx` — banner de instalação
- [ ] Criar `src/components/pwa/UpdatePrompt.tsx` — notificação de atualização

### 2. Otimizações de Performance
- [ ] Auditar bundle size: `npm run build -- --analyze`
- [ ] Code splitting por rota (já usa lazy — verificar)
- [ ] Lazy loading de imagens em todas as `<img>`
- [ ] Preload das rotas mais usadas (`/`, `/dashboard`, `/vendas`)
- [ ] Otimizar Recharts: importar só os componentes usados
- [ ] Configurar `staleTime` e `gcTime` otimizados por módulo
- [ ] Virtualização de listas longas (> 50 itens) com `@tanstack/react-virtual`

### 3. Core Web Vitals
- [ ] LCP (Largest Contentful Paint) < 2.5s — otimizar Dashboard inicial
- [ ] FID/INP < 100ms — garantir animações só em GPU props
- [ ] CLS < 0.1 — reservar espaço para skeletons

### 4. Lighthouse Audit
- [ ] Executar Lighthouse no Chrome DevTools
- [ ] Performance: > 90
- [ ] Accessibility: > 90
- [ ] Best Practices: > 90
- [ ] SEO: > 90
- [ ] PWA: ✅ Passable

---

## Testes da Sprint (7 testes obrigatórios)

### Arquivo: `src/test/pwa/manifest.test.ts`
```typescript
// TESTE 1: manifest.json tem campos obrigatórios
test('manifest.json contém name, short_name, icons, display, start_url')

// TESTE 2: Service Worker registrado corretamente
test('service worker é registrado sem erros no ambiente de produção')

// TESTE 3: InstallPrompt renderiza quando beforeinstallprompt dispara
test('InstallPrompt exibe banner quando evento PWA disponível')
```

### Arquivo: `src/test/performance/lazyLoading.test.ts`
```typescript
// TESTE 4: Rotas carregam lazily (não no bundle inicial)
test('Dashboard, Vendas e Login são os únicos chunks no bundle inicial')

// TESTE 5: Imagens têm atributo loading=lazy
test('todas as <img> nos componentes têm loading="lazy"')
```

### Arquivo: `src/test/performance/queryConfig.test.ts`
```typescript
// TESTE 6: staleTime configurado por módulo
test('hooks financeiros têm staleTime de 1 minuto')
test('useKPIs tem staleTime de 5 minutos')
```

**Total: 7 testes** _(mais Lighthouse manual)_  
**Critério:** 7 testes passam + Lighthouse > 90 em todas as categorias

---

## Resultado dos Testes

```
Executado em: —
Total acumulado: 0/157 — SPRINT BLOQUEADA

Lighthouse (manual):
  Performance: —
  Accessibility: —
  Best Practices: —
  SEO: —
  PWA: —
```

---

## Notas de Execução

_(Preencher durante/após a execução)_

---

## Atualização do CONTEXTO.md

Ao concluir esta sprint:
- [ ] Status Sprint 8 → ✅ Concluída
- [ ] Testes: `157 / 164`
- [ ] Registrar scores do Lighthouse
- [ ] Listar componentes PWA criados
