import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
  const tables = [
    'clientes', 'produtos', 'pedidos_venda', 'itens_estoque', 
    'titulos_receber', 'titulos_pagar', 'fornecedores', 
    'ordens_producao', 'ordens_servico', 'notas_fiscais', 
    'pedidos_expedicao', 'ncr', 'bens_patrimoniais',
    'perfis_usuario', 'log_auditoria', 'dashboard_kpis',
    'fluxo_caixa', 'dre', 'custos', 'rh_colaboradores',
    'pedidos_compra'
  ];

  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table "${t}": NOT ACCESSIBLE/NOT EXIST - ${error.message}`);
    } else {
      console.log(`Table "${t}": EXISTS (${data.length} rows returned in limit 1)`);
    }
  }
}

checkTables();
