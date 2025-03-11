import type { CacheConfig, XyConfig } from './XyConfig.ts'

const defaultGlobalCacheConfig: CacheConfig = {
  maxAge: 3600, staleWhileRevalidate: 30, staleIfError: 300,
}

const defaultProxyOriginalIndexCacheConfig: CacheConfig = { maxAge: 60 }

export const globalCacheConfigLoader = (config: XyConfig = {}) => {
  return { ...defaultGlobalCacheConfig, ...config?.metaServer?.caching }
}

export const proxyOriginalCacheConfigLoader = (config: XyConfig = {}) => {
  return { ...globalCacheConfigLoader(config), ...config?.metaServer?.proxyOriginal?.caching }
}

export const proxyOriginalIndexCacheConfigLoader = (config: XyConfig = {}) => {
  return {
    ...proxyOriginalCacheConfigLoader(config),
    ...defaultProxyOriginalIndexCacheConfig,
    ...config?.metaServer?.proxyOriginal?.indexCaching,
  }
}

export const proxyExternalCacheConfigLoader = (config: XyConfig = {}) => {
  return { ...globalCacheConfigLoader(config), ...config?.metaServer?.proxyExternal?.caching }
}

export const liveShareCacheConfigLoader = (config: XyConfig = {}) => {
  return { ...globalCacheConfigLoader(config), ...config?.metaServer?.liveShare?.caching }
}

export const liveShareImageCacheConfigLoader = (config: XyConfig = {}) => {
  return { ...liveShareCacheConfigLoader(config), ...config?.metaServer?.liveShare?.imageCaching }
}

export const dynamicShareCacheConfigLoader = (config: XyConfig = {}) => {
  return { ...globalCacheConfigLoader(config), ...config?.metaServer?.dynamicShare?.caching }
}
