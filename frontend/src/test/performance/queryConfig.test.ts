import { describe, test, expect } from 'vitest';
import { QUERY_STALE_TIME, QUERY_STALE_TIME_FINANCEIRO } from '../../lib/constants';

describe('query config', () => {
  test('hooks financeiros têm staleTime de 1 minuto', () => {
    expect(QUERY_STALE_TIME_FINANCEIRO).toBe(60 * 1000);
  });

  test('useKPIs tem staleTime de 5 minutos', () => {
    expect(QUERY_STALE_TIME).toBe(5 * 60 * 1000);
  });
});
