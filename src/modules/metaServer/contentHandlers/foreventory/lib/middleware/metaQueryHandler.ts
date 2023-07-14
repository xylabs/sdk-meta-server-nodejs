import { asyncHandler, Empty, NoReqParams } from '@xylabs/sdk-api-express-ecs'

type MetaLocals = Record<'meta', string>

export const metaQueryHandler = asyncHandler<NoReqParams, Empty, Empty, { meta?: string }, MetaLocals>((req, res, next) => {
  if (req.query.meta) {
    const hash = req.query.meta
    // TODO: Get hash from archivist
  }
  next()
})
