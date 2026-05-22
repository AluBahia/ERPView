import { readdir, stat, unlink } from 'fs/promises';
import { join } from 'path';
import { logger } from './logger.js';

export async function cleanupOldFiles(tempPath: string, maxAgeMinutes: number): Promise<void> {
  try {
    const files = await readdir(tempPath);
    const now = Date.now();
    for (const file of files) {
      const filePath = join(tempPath, file);
      const stats = await stat(filePath);
      const ageMs = now - stats.mtime.getTime();
      if (ageMs > maxAgeMinutes * 60 * 1000) {
        await unlink(filePath);
        logger.info(`Arquivo temporário removido: ${file}`);
      }
    }
  } catch (err) {
    logger.error('Erro na limpeza de arquivos temporários', { error: (err as Error).message });
  }
}
