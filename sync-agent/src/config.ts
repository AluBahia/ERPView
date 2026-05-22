import { z } from 'zod';

const configSchema = z.object({
  sqlServer: z.object({
    host: z.string().min(1),
    port: z.coerce.number().default(1433),
    database: z.string().min(1),
    user: z.string().min(1),
    password: z.string().min(1),
    encrypt: z.coerce.boolean().default(false),
    trustServerCertificate: z.coerce.boolean().default(true),
  }),
  supabase: z.object({
    url: z.string().url(),
    serviceRoleKey: z.string().min(1),
  }),
  sync: z.object({
    intervalMinutes: z.coerce.number().default(5),
    criticalIntervalMinutes: z.coerce.number().default(1),
  }),
  log: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    file: z.string().optional(),
  }),
});

function loadConfig() {
  return configSchema.parse({
    sqlServer: {
      host: process.env.SQLSERVER_HOST,
      port: process.env.SQLSERVER_PORT,
      database: process.env.SQLSERVER_DATABASE,
      user: process.env.SQLSERVER_USER,
      password: process.env.SQLSERVER_PASSWORD,
      encrypt: process.env.SQLSERVER_ENCRYPT,
      trustServerCertificate: process.env.SQLSERVER_TRUST_CERT,
    },
    supabase: {
      url: process.env.SUPABASE_URL,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    sync: {
      intervalMinutes: process.env.SYNC_INTERVAL_MINUTES,
      criticalIntervalMinutes: process.env.SYNC_CRITICAL_INTERVAL_MINUTES,
    },
    log: {
      level: process.env.LOG_LEVEL,
      file: process.env.LOG_FILE,
    },
  });
}

export const config = loadConfig();
export type Config = z.infer<typeof configSchema>;
