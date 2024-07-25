const rateLimitMap = new Map()

export function rateLimit(req: Request) {
  const ip = (req.headers.get("X-Forwarded-For") ?? "127.0.0.1").split(",")[0]
  const limit = 3 // Limiting requests to 3 per 5 minute per IP
  const windowMs = 5 * 60 * 1000 // 5 minutes

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, {
      count: 0,
      lastReset: Date.now(),
    })
  }

  const ipData = rateLimitMap.get(ip)

  if (Date.now() - ipData.lastReset > windowMs) {
    ipData.count = 0
    ipData.lastReset = Date.now()
  }

  if (ipData.count >= limit) {
    return true // Rate limit exceeded
  }

  ipData.count += 1

  return null
}
