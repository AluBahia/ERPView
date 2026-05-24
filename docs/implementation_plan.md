# Plano de Implementação — Alinhamento de Schema e Queries do Sync Agent

Este plano visa corrigir os erros de sincronização causados por colunas e tabelas inexistentes no banco de dados do Supabase, além de corrigir queries inválidas no SQL Server local.

## User Review Required

> [!IMPORTANT]
> O Sync Agent foi originalmente escrito usando um schema fictício que não corresponde ao banco de dados do Supabase real (definido no `supabase-schema.sql` e utilizado pelo frontend). 
> 
> Para que a sincronização funcione de verdade e os dados apareçam no Dashboard, faremos as seguintes alterações estruturais no Sync Agent:
> 1. **Mapeamento Financeiro:** O agent tentava gravar em uma tabela genérica `titulos`. Iremos desmembrar isso em duas sincronizações: `titulos_receber` e `titulos_pagar` (que são as tabelas reais do Supabase consumidas pelo frontend).
> 2. **Remoção de Colunas Inexistentes:** Colunas do ERP local que não existem no Supabase (como `clientes.cnpj`, `produtos.unidade`, etc.) serão removidas do mapeamento do Supabase para evitar erros.
> 3. **Uso de Joins no SQL Server:** Em tabelas como `itens_estoque` e `pedidos_expedicao`, faremos joins no SQL Server local para obter informações completas (ex: nome do cliente e descrição do produto) e preencher as tabelas no Supabase corretamente.
> 4. **Ajuste na Query de Notas Fiscais:** A tabela `CtrlNotaFiscal` local não possui a coluna `DataAtualizacao`. Ajustaremos a query para usar `DataEmissao` como parâmetro de alteração.
> 5. **Log de Auditoria:** Ajustaremos o envio do heartbeat e log de sincronização para usarem as colunas reais da tabela `log_auditoria` do Supabase (`acao`, `tabela`, `dados`, `timestamp`).

## Proposed Changes

### Sync Agent Components

---

#### [MODIFY] [clientes.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/clientes.ts)
* Ajustar a busca no Supabase (`fetchAll`) para trazer apenas as colunas que existem na tabela `clientes` do schema.
* Mapear os campos do SQL Server local para a tabela `clientes` do Supabase:
  - `codigo` <- `f.id` (código do cliente)
  - `nome` <- `f.nome`
  - `segmento` <- 'Geral' (padrão)
  - `volume_compras` <- 0
  - `frequencia` <- 'Eventual'
  - `prazo_medio` <- 'Fatura'
  - `classe_abc` <- 'C'
  - `status_credito` <- 'OK'

#### [MODIFY] [produtos.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/produtos.ts)
* Remover os campos `unidade` e `ativo` da sincronização do Supabase.
* Mapear os campos locais para as colunas reais de `produtos`:
  - `codigo` <- `f.codigo`
  - `descricao` <- `f.descricao`
  - `custo` <- `f.custo_medio`
  - `preco_venda` <- `f.preco_venda`
  - `margem` <- `f.preco_venda > 0 ? ((f.preco_venda - f.custo_medio) / f.preco_venda) * 100 : 0`
  - `giro` <- 'Médio'
  - `familia` <- 'Geral'

#### [MODIFY] [estoque.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/estoque.ts)
* Ajustar a query do SQL Server local para fazer um `INNER JOIN` com `Produtos` para pegar a descrição e código do produto.
* Mapear para a tabela `itens_estoque` do Supabase:
  - `codigo` <- `P.Referencia`
  - `descricao` <- `P.Nome`
  - `saldo` <- `E.Quantidade`
  - `minimo` <- 0
  - `status` <- 'OK'
  - `cobertura` <- ''
  - `deposito` <- 'Principal'

#### [MODIFY] [pedidos-venda.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/pedidos-venda.ts)
* Mapear para a tabela `pedidos_venda` do Supabase:
  - `id` <- `f.id`
  - `numero` <- `f.numero`
  - `cliente_id` <- `f.cliente_id` (se for numérico)
  - `vendedor` <- `f.vendedor_id` (salvar o código/nome do vendedor no campo `vendedor` do Supabase)
  - `data_pedido` <- `f.data_emissao` (salvar a data da venda no campo `data_pedido` do Supabase)
  - `valor_total` <- `f.valor_total`
  - `status` <- `f.status`

#### [MODIFY] [fornecedores.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/fornecedores.ts)
* Ajustar para sincronizar com as colunas reais do Supabase:
  - `id` <- `f.id`
  - `nome` <- `f.nome`
  - `categoria` <- 'Geral'
  - `avaliacao` <- 5.0
  - `homologacao` <- 'Homologado'
  - `documentacao` <- 'OK'

#### [MODIFY] [producao.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/producao.ts)
* Mapear para a tabela `ordens_producao` do Supabase:
  - `id` <- `f.id`
  - `produto` <- `f.linha` (usar a linha de produção ou 'Produto A' como nome do produto)
  - `quantidade` <- `f.quantidade`
  - `inicio_prev` <- `f.data_inicio`
  - `fim_prev` <- `f.data_previsao`
  - `status` <- `f.status`
  - `desvio` <- 'Nenhum'

#### [MODIFY] [expedicao.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/expedicao.ts)
* Adicionar `LEFT JOIN Clientes` na query do SQL Server para buscar o nome do cliente e cidade.
* Mapear para a tabela `pedidos_expedicao` do Supabase:
  - `id` <- `f.id`
  - `numero` <- `f.numero`
  - `cliente` <- `f.cliente`
  - `cidade` <- `f.cidade`
  - `status` <- `f.status`
  - `prev_entrega` <- `f.prev_entrega`
  - `peso` <- `f.peso`
  - `transportadora` <- `f.transportadora`

#### [MODIFY] [manutencao.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/manutencao.ts)
* Mapear para a tabela `ordens_servico` do Supabase:
  - `id` <- `f.id`
  - `equipamento` <- `f.descricao` (nome do equipamento/descrição do serviço)
  - `tipo` <- `f.tipo` (ex: 'Preventiva', 'Corretiva')
  - `prioridade` <- 'Média'
  - `abertura` <- `f.data_abertura`
  - `prev_conclusao` <- `f.data_conclusao`
  - `status` <- `f.status`

#### [MODIFY] [patrimonio.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/patrimonio.ts)
* Mapear para a tabela `bens_patrimoniais` do Supabase:
  - `id` <- `f.id`
  - `codigo` <- `f.codigo`
  - `descricao` <- `f.descricao`
  - `categoria` <- `f.categoria`
  - `localizacao` <- `f.localizacao`
  - `valor_original` <- `f.valor_aquisicao`
  - `depreciacao_acumulada` <- `0`
  - `valor_liquido` <- `f.valor_aquisicao`
  - `status` <- `f.status`

#### [MODIFY] [notas-fiscais.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/notas-fiscais.ts)
* Corrigir query local substituindo `DataAtualizacao AS data_atualizacao` por `N.DataEmissao AS data_atualizacao` e adicionando `LEFT JOIN Clientes/Fornecedores` para obter a `contraparte`.
* Mapear para a tabela `notas_fiscais` do Supabase:
  - `id` <- `f.id`
  - `numero` <- `f.numero`
  - `contraparte` <- `f.contraparte`
  - `data_emissao` <- `f.data_emissao`
  - `valor` <- `f.valor`
  - `tipo` <- `f.tipo`
  - `status` <- `f.status`

#### [MODIFY] [titulos.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/titulos.ts)
* Desmembrar o método `syncTitulos` para realizar a sincronização em duas tabelas separadas do Supabase: `titulos_receber` (onde Tipo = 'R') e `titulos_pagar` (onde Tipo = 'P').
* Fazer duas operações de delta independentes.

#### [MODIFY] [orchestrator.ts](file:///d:/VS%20Code/ERPView/sync-agent/src/sync/orchestrator.ts)
* Corrigir o método `writeLogAuditoria` e `sendHeartbeat` para salvarem os registros utilizando a tabela `log_auditoria` do Supabase com as colunas corretas:
  - `acao` <- 'sync' ou 'heartbeat'
  - `tabela` <- 'sistema'
  - `dados` <- JSON contendo os resultados ou status
  - `timestamp` <- data atual

---

## Verification Plan

### Automated Tests
- Compilar o Sync Agent localmente com `npm run build` para garantir que o TypeScript compila sem erros (`tsc --noEmit` passa 100%).

### Manual Verification
- Iniciar o Sync Agent no servidor físico.
- Verificar o arquivo de log `sync-agent.log` para confirmar que todos os módulos sincronizam sem erros e com tempo de execução rápido.
