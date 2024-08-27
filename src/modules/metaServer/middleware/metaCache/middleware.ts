import type { Empty, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import type { RequestHandler } from 'express'

import type { MetaCacheLocals } from './MetaCacheLocals.ts'
import type { MetaCacheQueryParams } from './MetaCacheQueryParams.ts'
import { SimpleMetaCache } from './SimpleMetaCache.ts'

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
