import crypto from 'crypto';

export interface DeltaResult<T> {
  inseridos: T[];
  atualizados: T[];
  deletados: string[];
}

export function computeDelta<T extends Record<string, any>>(
  fonte: T[],
  destino: T[],
  keyField: keyof T,
  timestampField?: keyof T
): DeltaResult<T> {
  const destinoMap = new Map<string, T>();
  for (const d of destino) {
    destinoMap.set(String(d[keyField]), d);
  }

  const inseridos: T[] = [];
  const atualizados: T[] = [];
  const fonteKeys = new Set<string>();

  for (const f of fonte) {
    const key = String(f[keyField]);
    fonteKeys.add(key);
    const existente = destinoMap.get(key);

    if (!existente) {
      inseridos.push(f);
    } else if (timestampField) {
      const fonteTs = f[timestampField] ? new Date(String(f[timestampField])).getTime() : 0;
      const destinoTs = existente[timestampField] ? new Date(String(existente[timestampField])).getTime() : 0;
      if (fonteTs > destinoTs) {
        atualizados.push(f);
      }
    } else if (hashRecord(f) !== hashRecord(existente)) {
      atualizados.push(f);
    }
  }

  const deletados: string[] = [];
  for (const key of destinoMap.keys()) {
    if (!fonteKeys.has(key)) {
      deletados.push(key);
    }
  }

  return { inseridos, atualizados, deletados };
}

function hashRecord<T extends Record<string, any>>(record: T): string {
  const str = JSON.stringify(record, Object.keys(record).sort());
  return crypto.createHash('md5').update(str).digest('hex');
}
