import { asyncHandler, Empty, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { MetaCacheLocals } from './MetaCacheLocals'
import { MetaCacheQueryParams } from './MetaCacheQueryParams'
import { SimpleMetaCache } from './SimpleMetaCache'

export const metaCache = (): RequestHandler<NoReqParams, Empty, Empty, MetaCacheQueryParams, MetaCacheLocals> => {
  const cache = new SimpleMetaCache()
  return asyncHandler(async (req, res, next) => {
    // Simulate potentially blocking work
    await Promise.resolve()
    res.locals.metaCache = cache
    next()
  })
}
