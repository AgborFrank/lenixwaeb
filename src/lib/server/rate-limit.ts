const requestBuckets = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const activeRequests = (requestBuckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);

  if (activeRequests.length >= limit) {
    return false;
  }

  activeRequests.push(now);
  requestBuckets.set(key, activeRequests);
  return true;
}
