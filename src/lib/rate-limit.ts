/**
 * Rate Limiter em memória para endpoints de autenticação.
 *
 * IMPORTANTE: Esta implementação funciona por instância de servidor (processo Node.js).
 * Em ambientes serverless (Vercel Functions), cada cold-start é uma nova instância e
 * o estado não é compartilhado entre instâncias simultâneas.
 *
 * Para escala de produção com múltiplas instâncias, substitua por Upstash Redis:
 * https://docs.upstash.com/redis/integrations/ratelimit
 *
 * Para os endpoints de auth desta aplicação, esta implementação é suficiente para
 * bloquear ataques de força bruta simples em uma única instância serverless.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

// Map: chave (IP + endpoint) → { count, resetAt }
const store = new Map<string, RateLimitEntry>()

// Limpar entradas expiradas periodicamente (evita memory leak em long-running servers)
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key)
  }
}, 60_000) // a cada 1 minuto

export interface RateLimitConfig {
  /** Número máximo de tentativas na janela */
  limit: number
  /** Duração da janela em segundos */
  windowSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

/**
 * Verifica e incrementa o contador de rate limit para a chave dada.
 * @param key  Identificador único (ex.: `login:${ip}`)
 * @param config  Configuração de limite e janela
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now()
  const windowMs = config.windowSeconds * 1000

  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    // Primeira tentativa ou janela expirou — resetar
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: config.limit - 1, resetAt }
  }

  if (entry.count >= config.limit) {
    // Limite atingido
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  // Incrementar contador
  entry.count++
  return { allowed: true, remaining: config.limit - entry.count, resetAt: entry.resetAt }
}

/** Extrai o IP do cliente de um Request do Next.js (Vercel injeta x-forwarded-for). */
export function getClientIp(request: Request): string {
  const forwarded = (request.headers as Headers).get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}
