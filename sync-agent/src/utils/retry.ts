import { logger } from '../logger.js';

export async function retry<T>(
  fn: () => Promise<T> | PromiseLike<T>,
  options: { maxRetries?: number; baseDelayMs?: number; label?: string } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000, label = 'operation' } = options;
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        logger.warn(`${label} falhou (tentativa ${attempt + 1}/${maxRetries + 1}), retry em ${delay}ms`, {
          error: lastError.message,
        });
        await sleep(delay);
      }
    }
  }

  logger.error(`${label} falhou após ${maxRetries + 1} tentativas`, { error: lastError!.message });
  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
