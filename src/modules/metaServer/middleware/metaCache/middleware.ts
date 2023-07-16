import { asyncHandler, Empty, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { Payload } from '@xyo-network/payload-model'
import { Meta } from '@xyo-network/sdk-meta'
import { Request, RequestHandler, Response } from 'express'

import { getArchivistDomainFromUri, getArchivistForDomain, getUriBehindProxy } from '../../lib'
import { MetaCacheLocals } from './MetaCacheLocals'
import { MetaCacheQueryParams } from './MetaCacheQueryParams'
import { SimpleMetaCache } from './SimpleMetaCache'

const augmentMetaViaQueryHash = false

const getMetaFromHash = async (req: Request<NoReqParams, Empty, Empty, MetaCacheQueryParams>, res: Response): Promise<void> => {
  if (req.query.meta) {
    const hash = req.query.meta
    const uri = getUriBehindProxy(req as Request)
    const domain = getArchivistDomainFromUri(uri)
    const archivist = await getArchivistForDomain(domain)
    const results = await archivist.get([hash])
    const payload = results?.[0]
    // TODO: Validate schema
    if (payload) {
      delete (payload as Partial<Payload>)?.schema
      const meta: Meta = { ...payload } as Meta
      res.locals.meta = meta
    }
  }
}

export const metaCache = (): RequestHandler<NoReqParams, Empty, Empty, MetaCacheQueryParams, MetaCacheLocals> => {
  const cache = new SimpleMetaCache()
  return asyncHandler(async (req, res, next) => {
    res.locals.metaCache = cache
    if (augmentMetaViaQueryHash) await getMetaFromHash(req, res)
    next()
  })
}
