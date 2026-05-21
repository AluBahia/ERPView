import { describe, test, expect } from 'vitest';
import { supabase } from '../../lib/supabase';
import fs from 'fs';
import path from 'path';

describe('Sprint 0: Infraestrutura e Configuração de Testes', () => {
  // Teste 1: O ambiente do Vitest inicia corretamente
  test('1. O ambiente do Vitest inicia corretamente', () => {
    expect(true).toBe(true);
    expect(1 + 1).toBe(2);
  });

  // Teste 2: O MSW intercepta requisições de rede corretamente
  test('2. O MSW intercepta requisições de rede corretamente', async () => {
    const response = await fetch('http://localhost:3000/api/exemplo');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ mensagem: 'Olá do MSW' });
  });

  // Teste 3: O Mock do Supabase responde com dados mockados padrão
  test('3. O Mock do Supabase responde com dados mockados padrão', async () => {
    const { data, error } = await supabase.from('clientes').select('*');
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toEqual([]);
  });

  // Teste 4: Os arquivos de schema SQL contêm a definição de todas as tabelas esperadas
  test('4. Os arquivos de schema SQL contêm a definição de todas as tabelas esperadas', () => {
    const rootDir = path.resolve(__dirname, '../../../../');
    const schemaV1Path = path.join(rootDir, 'supabase-schema.sql');
    const schemaV2Path = path.join(rootDir, 'supabase-schema-v2.sql');

    expect(fs.existsSync(schemaV1Path)).toBe(true);
    expect(fs.existsSync(schemaV2Path)).toBe(true);

    const schemaV1Content = fs.readFileSync(schemaV1Path, 'utf-8');
    const schemaV2Content = fs.readFileSync(schemaV2Path, 'utf-8');
    const combinedSchema = (schemaV1Content + '\n' + schemaV2Content).toLowerCase();

    const expectedTables = [
      'clientes',
      'produtos',
      'pedidos_venda',
      'itens_estoque',
      'titulos_receber',
      'titulos_pagar',
      'fornecedores',
      'ordens_producao',
      'ordens_servico',
      'notas_fiscais',
      'pedidos_expedicao',
      'ncr',
      'bens_patrimoniais',
      'perfis_usuario',
      'log_auditoria',
      'dashboard_kpis',
      'fluxo_caixa',
      'dre',
      'custos',
      'rh_colaboradores'
    ];

    expectedTables.forEach(table => {
      const createTableRegex = new RegExp(`create\\s+table\\s+(if\\s+not\\s+exists\\s+)?${table}\\b`);
      expect(createTableRegex.test(combinedSchema)).toBe(true);
    });
  });

  // Teste 5: A estrutura de diretórios e arquivos de configuração atende às regras do projeto
  test('5. A estrutura de diretórios e arquivos de configuração atende às regras do projeto', () => {
    const frontendDir = path.resolve(__dirname, '../../');
    const expectedDirs = [
      'pages',
      'components',
      'store',
      'hooks',
      'lib',
      'test'
    ];

    expectedDirs.forEach(dirName => {
      const dirPath = path.join(frontendDir, dirName);
      expect(fs.existsSync(dirPath)).toBe(true);
      const stat = fs.statSync(dirPath);
      expect(stat.isDirectory()).toBe(true);
    });
  });
});
