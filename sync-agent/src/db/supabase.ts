import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

export const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const PAGE_SIZE = 5000;

/**
 * Busca TODOS os registros de uma tabela usando paginação automática.
 * O Supabase limita a 1000 rows por padrão — sem isso, o delta sempre
 * enxerga o destino como vazio e reinsere tudo desnecessariamente.
 */
export async function fetchAll<T = Record<string, unknown>>(
  table: string,
  columns = '*'
): Promise<T[]> {
  const all: T[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error(`fetchAll(${table}): ${error.message}`);
    if (!data || data.length === 0) break;

    all.push(...(data as T[]));

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return all;
}
