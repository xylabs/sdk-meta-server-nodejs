export interface PathFilter {
  exclude: string[]
  include: string[]
}

export interface MetaServerConfig {
  dynamicShare?: PathFilter
  languageMap?: Record<string, PathFilter>
  liveShare?: PathFilter
  proxyExternal?: Record<string, PathFilter>
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
