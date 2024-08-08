import { NoLocals } from '@xylabs/sdk-api-express-ecs'

import { MetaCache } from './MetaCache.ts'

export type MetaCacheProperties = {
  /**
   * The cache uses to augment HTML metadata for HTML routes
   */
  metaCache: MetaCache
}

export type MetaCacheLocals = NoLocals & MetaCacheProperties
