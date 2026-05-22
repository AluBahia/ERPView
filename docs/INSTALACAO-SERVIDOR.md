# ERPView — Instalação no Servidor

> Guia técnico para instalação do **Sync Agent** e **CR Service** no servidor Windows local.

---

## Pré-requisitos do Servidor

| Requisito | Versão Mínima | Verificação |
|-----------|--------------|-------------|
| Windows Server | 2012 R2 | `winver` |
| Node.js | 18.x LTS | `node --version` |
| npm | 9.x | `npm --version` |
| Crystal Reports Runtime | 13 (SP32) | Painel de Controle → Programas |
| SQL Server Client | 2008+ | Driver ODBC instalado |
| Acesso ao SQL Server | somente leitura | Usuário `erp_readonly` criado |

---

## Criação do Usuário SQL Server (somente leitura)

Execute no SQL Server Management Studio como SA:

```sql
-- Criar login
CREATE LOGIN erp_readonly WITH PASSWORD = 'SuaSenhaForte#2026';

-- Criar usuário no banco do ERP
USE ERP_PRODUCAO;
CREATE USER erp_readonly FOR LOGIN erp_readonly;

-- Conceder apenas leitura
EXEC sp_addrolemember 'db_datareader', 'erp_readonly';
```

---

## Instalação do Sync Agent

### 1. Clonar/copiar o repositório

```
C:\ERPView\
├── sync-agent\
├── cr-service\
└── logs\
```

```powershell
# Criar diretório de logs
New-Item -ItemType Directory -Force -Path "C:\ERPView\logs"
```

### 2. Instalar dependências

```powershell
cd C:\ERPView\sync-agent
npm install
npm run build
```

### 3. Configurar variáveis de ambiente

```powershell
copy .env.example .env
notepad .env
```

Preencha o arquivo `.env`:

```env
SQLSERVER_HOST=NOME_DO_SERVIDOR_SQL
SQLSERVER_PORT=1433
SQLSERVER_DATABASE=ERP_PRODUCAO
SQLSERVER_USER=erp_readonly
SQLSERVER_PASSWORD=SuaSenhaForte#2026
SQLSERVER_ENCRYPT=false
SQLSERVER_TRUST_CERT=true

SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...SUA_SERVICE_ROLE_KEY

SYNC_INTERVAL_MINUTES=5
SYNC_CRITICAL_INTERVAL_MINUTES=1
LOG_LEVEL=info
LOG_FILE=C:\ERPView\logs\sync-agent.log
```

> ⚠️ **NUNCA compartilhe a `SUPABASE_SERVICE_ROLE_KEY`.** Ela tem acesso total ao banco.

### 4. Testar a conexão

```powershell
cd C:\ERPView\sync-agent
node dist/index.js --test
```

Resultado esperado:
```
[INFO] Conexão SQL Server: OK
[INFO] Conexão Supabase: OK
[INFO] Sync agent pronto para iniciar
```

### 5. Instalar como Serviço Windows

```powershell
# Executar como Administrador
cd C:\ERPView\sync-agent
node dist/install-service.js
```

Verificar instalação:

```powershell
Get-Service -Name "ERPView-SyncAgent"
# Status: Running
```

### 6. Gerenciar o serviço

```powershell
# Iniciar
Start-Service -Name "ERPView-SyncAgent"

# Parar
Stop-Service -Name "ERPView-SyncAgent"

# Reiniciar
Restart-Service -Name "ERPView-SyncAgent"

# Ver logs em tempo real
Get-Content "C:\ERPView\logs\sync-agent.log" -Wait -Tail 50
```

### 7. Desinstalar o serviço (se necessário)

```powershell
cd C:\ERPView\sync-agent
node dist/install-service.js --uninstall
```

---

## Instalação do CR Service

### 1. Instalar dependências

```powershell
cd C:\ERPView\cr-service
npm install
npm run build
```

### 2. Configurar variáveis de ambiente

```powershell
copy .env.example .env
notepad .env
```

```env
PORT=3001
SUPABASE_URL=https://SEU_PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...SUA_SERVICE_ROLE_KEY
CR_REPORTS_PATH=C:\CrystalReports\Relatorios
CR_TEMP_PATH=C:\CrystalReports\Temp
CR_CACHE_TTL_MINUTES=5
LOG_FILE=C:\ERPView\logs\cr-service.log
```

### 3. Configurar os arquivos .rpt

Copie os arquivos Crystal Reports para o diretório configurado em `CR_REPORTS_PATH`:

```
C:\CrystalReports\Relatorios\
├── VendasPeriodo.rpt
├── ComprasPeriodo.rpt
├── EstoqueAtual.rpt
├── TitulosReceber.rpt
├── TitulosPagar.rpt
├── DREMensal.rpt
├── FluxoCaixa.rpt
└── NotasFiscais.rpt
```

> ⚠️ Os arquivos `.rpt` **nunca são modificados** — apenas lidos pelo Crystal Reports Runtime.

### 4. Criar diretório temporário

```powershell
New-Item -ItemType Directory -Force -Path "C:\CrystalReports\Temp"
```

### 5. Testar o CR Service

```powershell
cd C:\ERPView\cr-service
node dist/index.js
# Servidor iniciado na porta 3001
```

Testar endpoint (em outro terminal):

```powershell
# Deve retornar 401 (sem token — correto!)
Invoke-WebRequest -Uri "http://localhost:3001/relatorios/vendas-periodo?dataInicio=2026-01-01" -Method GET
```

### 6. Instalar como Serviço Windows com NSSM

O CR Service pode ser instalado como serviço usando o NSSM (Non-Sucking Service Manager):

```powershell
# Baixar NSSM em https://nssm.cc/download
# Extrair para C:\Tools\nssm\

C:\Tools\nssm\win64\nssm.exe install ERPView-CRService "C:\Program Files\nodejs\node.exe" "C:\ERPView\cr-service\dist\index.js"
C:\Tools\nssm\win64\nssm.exe set ERPView-CRService AppDirectory "C:\ERPView\cr-service"
C:\Tools\nssm\win64\nssm.exe set ERPView-CRService AppEnvironmentExtra "NODE_ENV=production"
Start-Service -Name "ERPView-CRService"
```

---

## Firewall e Rede

### Porta do CR Service (3001)

O CR Service roda localmente e só deve ser acessível da **rede interna**. Configure o Firewall do Windows:

```powershell
# Permitir acesso à porta 3001 apenas da rede interna
New-NetFirewallRule -DisplayName "ERPView CR Service" `
  -Direction Inbound -Protocol TCP -LocalPort 3001 `
  -RemoteAddress 192.168.0.0/16 -Action Allow
```

### Acesso remoto (VPN)

Para usuários que trabalham remotamente precisarem gerar relatórios, configure acesso VPN à rede interna.

---

## Monitoramento e Logs

### Localização dos logs

| Serviço | Arquivo de Log |
|---------|---------------|
| Sync Agent | `C:\ERPView\logs\sync-agent.log` |
| CR Service | `C:\ERPView\logs\cr-service.log` |

### Rotação de logs

Configure rotação automática usando o Agendador de Tarefas do Windows para limpar logs > 30 dias:

```powershell
# Criar tarefa agendada de limpeza de logs
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
  -Argument '-Command "Get-ChildItem C:\ERPView\logs\*.log | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item"'
$trigger = New-ScheduledTaskTrigger -Daily -At "02:00"
Register-ScheduledTask -TaskName "ERPView-LimpezaLogs" -Action $action -Trigger $trigger -RunLevel Highest
```

### Verificação de saúde

No Supabase, verifique a tabela `log_auditoria`. O Sync Agent deve gravar:
- Um **heartbeat** a cada 30 segundos com `tipo = 'heartbeat'`
- Um **resultado de sync** a cada 5 minutos com `tipo = 'sync'`

Se o heartbeat parar, o serviço pode ter travado — reinicie-o.

---

## Atualizações

Para atualizar o Sync Agent ou CR Service:

```powershell
# Parar serviço
Stop-Service -Name "ERPView-SyncAgent"

# Baixar nova versão (git pull ou copiar arquivos)
cd C:\ERPView
git pull origin main

# Recompilar
cd sync-agent && npm install && npm run build
cd ..\cr-service && npm install && npm run build

# Reiniciar serviços
Start-Service -Name "ERPView-SyncAgent"
Start-Service -Name "ERPView-CRService"
```

---

## Troubleshooting

### Sync Agent não conecta ao SQL Server

1. Verifique se o SQL Server está aceitando conexões TCP/IP (SQL Server Configuration Manager)
2. Confirme porta 1433 aberta no firewall do servidor SQL
3. Teste a conexão: `telnet NOME_SERVIDOR 1433`
4. Verifique credenciais no `.env`

### Crystal Reports não gera PDF

1. Confirme que o Crystal Reports Runtime 13 está instalado
2. Verifique se os arquivos `.rpt` existem em `CR_REPORTS_PATH`
3. Confirme que o usuário do serviço Windows tem permissão de escrita em `CR_TEMP_PATH`
4. Teste o script PowerShell manualmente:
   ```powershell
   powershell -File "C:\ERPView\cr-service\scripts\gerar-relatorio.ps1" -NomeRelatorio "vendas-periodo" -Parametros "{}" -SaidaPdf "C:\Temp\teste.pdf"
   ```

### Frontend mostra dados desatualizados

1. Verifique se o Sync Agent está rodando: `Get-Service ERPView-SyncAgent`
2. Verifique o log: `Get-Content C:\ERPView\logs\sync-agent.log -Tail 100`
3. Verifique a tabela `log_auditoria` no Supabase para ver o último heartbeat

---

## Contato Técnico

Para suporte à instalação, entre em contato com o desenvolvedor responsável pelo projeto ERPView.
