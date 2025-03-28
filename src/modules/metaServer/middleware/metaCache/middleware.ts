import type { Empty, NoReqParams } from '@xylabs/express'
import type { RequestHandler } from 'express'

import type { MetaCacheLocals } from './MetaCacheLocals.ts'
import type { MetaCacheQueryParams } from './MetaCacheQueryParams.ts'
import { SimpleMetaCache } from './SimpleMetaCache.ts'

export const metaCache = (): RequestHandler<NoReqParams, Empty, Empty, MetaCacheQueryParams, MetaCacheLocals> => {
  const cache = new SimpleMetaCache()

  return (req, res, next) => {
    res.locals.metaCache = cache
    next()
  }
}
