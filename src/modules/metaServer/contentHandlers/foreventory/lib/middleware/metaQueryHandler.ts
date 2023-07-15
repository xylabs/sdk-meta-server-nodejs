import { asyncHandler, Empty, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { Payload } from '@xyo-network/payload-model'
import { Meta } from '@xyo-network/sdk-meta'

import { getArchivistDomainFromUri, getArchivistForDomain, getUriBehindProxy } from '../../../../lib'
import { MetaLocals } from './MetaLocals'

export const metaQueryHandler = asyncHandler<NoReqParams, Empty, Empty, { meta?: string }, MetaLocals>(async (req, res, next) => {
  if (req.query.meta) {
    const hash = req.query.meta
    const uri = getUriBehindProxy(req)
    const domain = getArchivistDomainFromUri(uri)
    const archivist = await getArchivistForDomain(domain)
    const results = await archivist.get([hash])
    const payload = results?.[0]
    if (payload) {
      delete (payload as Partial<Payload>)?.schema
      const meta: Meta = { ...payload } as Meta
      res.locals.meta = meta
    }
  }
  next()
})
