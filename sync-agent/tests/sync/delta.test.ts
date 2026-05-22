import { describe, test, expect } from 'vitest';
import { computeDelta } from '../../src/utils/delta.js';
import { retry } from '../../src/utils/retry.js';

describe('delta', () => {
  test('delta identifica registro novo para inserção', () => {
    const fonte = [{ id: '1', nome: 'A', updated_at: '2024-01-01' }];
    const destino: typeof fonte = [];
    const result = computeDelta(fonte, destino, 'id', 'updated_at');
    expect(result.inseridos).toHaveLength(1);
    expect(result.atualizados).toHaveLength(0);
    expect(result.deletados).toHaveLength(0);
  });

  test('delta identifica registro modificado para atualização', () => {
    const fonte = [{ id: '1', nome: 'A Updated', updated_at: '2024-02-01' }];
    const destino = [{ id: '1', nome: 'A', updated_at: '2024-01-01' }];
    const result = computeDelta(fonte, destino, 'id', 'updated_at');
    expect(result.inseridos).toHaveLength(0);
    expect(result.atualizados).toHaveLength(1);
    expect(result.deletados).toHaveLength(0);
  });

  test('delta ignora registro sem alterações', () => {
    const fonte = [{ id: '1', nome: 'A', updated_at: '2024-01-01' }];
    const destino = [{ id: '1', nome: 'A', updated_at: '2024-01-01' }];
    const result = computeDelta(fonte, destino, 'id', 'updated_at');
    expect(result.inseridos).toHaveLength(0);
    expect(result.atualizados).toHaveLength(0);
    expect(result.deletados).toHaveLength(0);
  });
});

describe('retry', () => {
  test('retry tenta 3x com backoff antes de lançar erro final', async () => {
    let attempts = 0;
    const fn = async () => {
      attempts++;
      throw new Error('fail');
    };
    await expect(retry(fn, { maxRetries: 2, baseDelayMs: 10 })).rejects.toThrow('fail');
    expect(attempts).toBe(3);
  });

  test('backoff aumenta tempo: 1s, 2s, 4s entre tentativas', async () => {
    const delays: number[] = [];
    let lastTime = Date.now();
    const fn = async () => {
      const now = Date.now();
      delays.push(now - lastTime);
      lastTime = now;
      throw new Error('fail');
    };
    try {
      await retry(fn, { maxRetries: 3, baseDelayMs: 100 });
    } catch {}
    // Primeira tentativa não tem delay, depois 100ms, 200ms, 400ms
    expect(delays[1]).toBeGreaterThanOrEqual(80);
    expect(delays[2]).toBeGreaterThanOrEqual(160);
    expect(delays[3]).toBeGreaterThanOrEqual(320);
  });
});
