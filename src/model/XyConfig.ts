export interface PathFilter {
  exclude: string[]
  include: string[]
}

export interface XyConfig {
  dynamicShare?: PathFilter
  languageMap?: Record<string, PathFilter>
  liveShare?: PathFilter
  proxyExternal?: Record<string, PathFilter>
}
