import { z } from 'zod';

const configSchema = z.object({
  port: z.coerce.number().default(3001),
  supabase: z.object({
    url: z.string().url(),
    serviceRoleKey: z.string().min(1),
  }),
  cr: z.object({
    reportsPath: z.string().min(1),
    tempPath: z.string().min(1),
    cacheTtlMinutes: z.coerce.number().default(5),
  }),
  log: z.object({
    file: z.string().optional(),
  }),
});

function loadConfig() {
  return configSchema.parse({
    port: process.env.PORT,
    supabase: {
      url: process.env.SUPABASE_URL,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    cr: {
      reportsPath: process.env.CR_REPORTS_PATH,
      tempPath: process.env.CR_TEMP_PATH,
      cacheTtlMinutes: process.env.CR_CACHE_TTL_MINUTES,
    },
    log: {
      file: process.env.LOG_FILE,
    },
  });
}

export const config = loadConfig();
