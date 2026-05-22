import sql from 'mssql';
import { config } from '../config.js';
import { logger } from '../logger.js';

const poolConfig: sql.config = {
  server: config.sqlServer.host,
  port: config.sqlServer.port,
  database: config.sqlServer.database,
  user: config.sqlServer.user,
  password: config.sqlServer.password,
  options: {
    encrypt: config.sqlServer.encrypt,
    trustServerCertificate: config.sqlServer.trustServerCertificate,
    cryptoCredentialsDetails: {
      minVersion: 'TLSv1',
      ciphers: 'DEFAULT:@SECLEVEL=0',
    },
  },
  pool: {
    min: 1,
    max: 5,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getSqlPool(): Promise<sql.ConnectionPool> {
  if (pool && pool.connected) return pool;
  pool = await sql.connect(poolConfig);
  logger.info('SQL Server pool conectado');
  return pool;
}

export async function sqlHealthCheck(): Promise<boolean> {
  try {
    const p = await getSqlPool();
    const result = await p.request().query('SELECT 1 AS health');
    return result.recordset[0]?.health === 1;
  } catch (err) {
    logger.error('SQL Server health check falhou', { error: (err as Error).message });
    return false;
  }
}

export async function query<T = unknown>(queryString: string): Promise<T[]> {
  const p = await getSqlPool();
  const result = await p.request().query(queryString);
  return result.recordset as T[];
}

export async function closeSqlPool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    logger.info('SQL Server pool fechado');
  }
}
