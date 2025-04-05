export interface PathFilter {
  exclude?: string[]
  include?: string[]
}

export interface CacheConfig {
  immutable?: boolean
  maxAge?: number
  maxStale?: number
  minFresh?: number
  mustRevalidate?: boolean
  mustUnderstand?: boolean
  noCache?: boolean
  noStore?: boolean
  noTransform?: boolean
  onlyIfCached?: boolean
  privateOnly?: boolean
  proxyRevalidate?: boolean
  sMaxAge?: number
  staleIfError?: number
  staleWhileRevalidate?: number
}

export interface MetaServerConfig {
  caching?: CacheConfig
  dynamicShare?: {
    caching?: CacheConfig
    pathFilter?: PathFilter
  }
  globalDefaults?: {
    caching?: CacheConfig
    headers?: Record<string, string>
  }
  languageMap?: {
    caching?: CacheConfig
    pathFilters?: Record<string, PathFilter>
  }
  liveShare?: {
    caching?: CacheConfig
    imageCaching?: CacheConfig
    pathFilter?: PathFilter
  }
  proxyExternal?: {
    caching?: CacheConfig
    pathFilters?: Record<string, PathFilter>
  }
  proxyOriginal?: {
    caching?: CacheConfig
    indexCaching?: CacheConfig
  }
}

export interface XyConfig {
  /** @deprecated use metaServer config instead */
  dynamicShare?: PathFilter
  /** @deprecated use metaServer config instead */
  languageMap?: Record<string, PathFilter>
  /** @deprecated use metaServer config instead */
  liveShare?: PathFilter

  metaServer?: MetaServerConfig

  /** @deprecated use metaServer config instead */
  proxyExternal?: Record<string, PathFilter>
}
