import { FastifyRequest, FastifyReply } from 'fastify';
import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function validateAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Token não fornecido' });
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return reply.status(401).send({ error: 'Token inválido ou expirado' });
  }

  // Anexa user à request para uso posterior
  (request as any).user = data.user;
}
