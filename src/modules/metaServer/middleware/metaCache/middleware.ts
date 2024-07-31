import { asyncHandler, Empty, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { MetaCacheLocals } from './MetaCacheLocals.js'
import { MetaCacheQueryParams } from './MetaCacheQueryParams.js'
import { SimpleMetaCache } from './SimpleMetaCache.js'

export const metaCache = (): RequestHandler<NoReqParams, Empty, Empty, MetaCacheQueryParams, MetaCacheLocals> => {
  const cache = new SimpleMetaCache()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return asyncHandler(async (req, res, next) => {
    // Simulate potentially blocking work
    await Promise.resolve()
    res.locals.metaCache = cache
    next()
  })
}
