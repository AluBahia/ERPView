# ERPView — Manual do Usuário

> Guia de uso para acesso e navegação no dashboard ERPView.

---

## Acesso ao Sistema

### Login

1. Acesse a URL do ERPView no navegador (Chrome recomendado)
2. Digite seu **e-mail** e **senha** fornecidos pelo administrador
3. Clique em **Entrar**

> ⚠️ Em caso de erro "Credenciais inválidas", verifique Caps Lock e tente novamente. Após 5 tentativas, aguarde 15 minutos.

### Instalação como App (PWA)

O ERPView pode ser instalado no seu dispositivo como um aplicativo:

- **Chrome/Edge Desktop:** clique no ícone ⊕ na barra de endereços
- **Android:** toque em "Adicionar à tela inicial" no menu do navegador
- **iOS Safari:** toque em Compartilhar → "Adicionar à Tela de Início"

---

## Navegação

A barra lateral esquerda contém todos os módulos disponíveis para o seu perfil. Módulos não autorizados não são exibidos.

### Grupos de Módulos

| Grupo | Módulos |
|-------|---------|
| **Comercial** | Vendas, Clientes, Compras, Fornecedores |
| **Operacional** | Estoque, Produtos, Produção, Qualidade, Expedição, Manutenção |
| **Financeiro** | Contas a Receber, Contas a Pagar, Fluxo de Caixa, DRE, Custos |
| **Corporativo** | Fiscal, RH, Patrimônio |

---

## Filtros

Cada módulo possui uma barra de filtros no topo da página.

### Como usar

1. Selecione o **período** usando o seletor de data
2. Use os filtros adicionais (status, cliente, fornecedor) conforme necessário
3. Os dados atualizam automaticamente após selecionar o filtro
4. Clique em **Limpar Filtros** para resetar

### Filtros globais

O filtro de período (data início / data fim) é compartilhado entre módulos. Se você mudar o período em Vendas e navegar para Compras, o mesmo período será aplicado.

---

## Dados em Tempo Real

Módulos marcados com o indicador **"Ao Vivo"** (🔴) na barra de título atualizam automaticamente quando há novos dados no ERP.

Módulos com realtime ativo:
- Vendas
- Estoque
- Produção
- Contas a Receber

---

## Relatórios (Crystal Reports)

Alguns módulos possuem o botão **📄 Gerar Relatório**. Ao clicar:

1. O sistema solicita ao servidor local a geração do PDF
2. Um indicador de carregamento é exibido (pode levar até 30 segundos)
3. O PDF abre em uma nova aba do navegador para impressão ou download

> ⚠️ O botão de relatório só funciona quando conectado à rede interna da empresa. Fora da empresa, use a VPN.

### Relatórios disponíveis por módulo

| Módulo | Relatório |
|--------|-----------|
| Vendas | Vendas por Período |
| Compras | Compras por Período |
| Estoque | Estoque Atual |
| Contas a Receber | Títulos a Receber |
| Contas a Pagar | Títulos a Pagar |
| DRE | DRE Mensal |
| Fluxo de Caixa | Fluxo de Caixa |
| Fiscal | Notas Fiscais |

---

## Dashboard Principal

A página inicial exibe KPIs consolidados do dia:

| KPI | Descrição |
|-----|-----------|
| **Vendas do Dia** | Total faturado hoje |
| **Vendas do Mês** | Acumulado do mês atual |
| **A Receber Vencido** | Títulos vencidos sem pagamento |
| **A Pagar (7 dias)** | Títulos a vencer nos próximos 7 dias |
| **NCRs Abertas** | Não conformidades sem resolução |
| **OS Pendentes** | Ordens de serviço em aberto |

---

## Exportação de Dados

Nos módulos com tabelas de dados, use o botão **⬇ Exportar** para baixar em formato CSV ou Excel.

---

## Comportamento Offline

Quando sem conexão com a internet, o ERPView exibe os **últimos dados carregados** em cache. Uma mensagem de aviso aparece no topo da tela.

Ao reconectar, os dados atualizam automaticamente.

---

## Perfis e Permissões

O que você vê no dashboard depende do seu perfil:

| Se você é... | Você vê... |
|-------------|-----------|
| Administrador | Tudo |
| Gerente | Vendas, Financeiro, Produção, RH |
| Operador de Vendas | Vendas, Clientes, Estoque, Produtos |
| Operador Financeiro | Receber, Pagar, Fluxo, DRE, Custos |
| Operador de Produção | Produção, Qualidade, Expedição, Manutenção |
| Visualizador | Somente o Dashboard |

---

## Solução de Problemas

### "Dados desatualizados"
Os dados são sincronizados do ERP a cada 5 minutos. Se os dados parecerem desatualizados, aguarde alguns minutos e recarregue a página (F5).

### "Erro ao carregar dados"
1. Verifique sua conexão com a internet
2. Tente recarregar a página
3. Se persistir, informe o administrador do sistema

### "Acesso Negado (403)"
Seu perfil não tem permissão para este módulo. Entre em contato com o administrador para solicitar acesso.

### Relatório não gera
1. Verifique se está conectado à rede interna ou VPN
2. Aguarde 30 segundos e tente novamente
3. Se persistir, informe ao TI

---

## Suporte

Para dúvidas ou problemas, entre em contato com a equipe de TI pelo ramal interno ou e-mail **ti@empresa.com.br**.
