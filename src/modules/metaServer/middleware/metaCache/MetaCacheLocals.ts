import type { NoLocals } from '@xylabs/express'

import type { MetaCache } from './MetaCache.ts'

export type MetaCacheProperties = {
  /**
   * The cache uses to augment HTML metadata for HTML routes
   */
  metaCache: MetaCache
}

export type MetaCacheLocals = NoLocals & MetaCacheProperties
