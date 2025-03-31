import type { CacheConfig } from '../../../model/index.ts'

export const headersFromCacheConfig = ({
  maxAge, noCache, privateOnly, sMaxAge,
  mustRevalidate, mustUnderstand,
  noStore, noTransform, onlyIfCached, proxyRevalidate,
  immutable, staleIfError, staleWhileRevalidate,
}: CacheConfig): Record<string, unknown> => {
  /*
  console.log('headersFromCacheConfigIn', {
    maxAge,
    noCache,
    privateOnly,
    sMaxAge,
    mustRevalidate,
    mustUnderstand,
    noStore,
    noTransform,
    onlyIfCached,
    proxyRevalidate,
    immutable,
    staleIfError,
    staleWhileRevalidate,
  })
    */
  const result: Record<string, unknown> = {}
  const cacheControlParts: string[] = []
  if (maxAge !== undefined) {
    cacheControlParts.push(`max-age=${maxAge}`)
    result['Expires'] = new Date(Date.now() + maxAge * 1000).toUTCString() // Expires in 60 seconds
  }
  if (sMaxAge !== undefined) {
    cacheControlParts.push(`s-maxage=${sMaxAge}`)
  }
  if (noCache) {
    cacheControlParts.push('no-cache')
  } else {
    cacheControlParts.push(privateOnly ? 'private' : 'public')
    if (mustRevalidate) {
      cacheControlParts.push('must-revalidate')
    }
    if (mustUnderstand) {
      cacheControlParts.push('must-understand')
    }
    if (proxyRevalidate) {
      cacheControlParts.push('proxy-revalidate')
    }
    if (noTransform) {
      cacheControlParts.push('no-transform')
    }
    if (onlyIfCached) {
      cacheControlParts.push('only-if-cached')
    }
    if (immutable) {
      cacheControlParts.push('immutable')
    }
    if (noStore) {
      cacheControlParts.push('no-store')
    }
    if (staleIfError !== undefined) {
      cacheControlParts.push(`stale-if-error=${staleIfError}`)
    }
    if (staleWhileRevalidate !== undefined) {
      cacheControlParts.push(`stale-while-revalidate=${staleWhileRevalidate}`)
    }
  }
  if (cacheControlParts.length > 0) {
    result['Cache-Control'] = cacheControlParts.join(', ')
  }
  console.log('headersFromCacheConfigOut', result)
  return result
}
