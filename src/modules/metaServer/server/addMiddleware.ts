import { customPoweredByHeader, disableCaseSensitiveRouting, disableExpressDefaultPoweredByHeader } from '@xylabs/sdk-api-express-ecs'
import { Express } from 'express'

import { metaCache } from '../middleware/index.ts'

export const addMiddleware = (app: Express) => {
  app.set('etag', false)
  disableExpressDefaultPoweredByHeader(app)
  app.use(customPoweredByHeader)
  disableCaseSensitiveRouting(app)
  app.use(metaCache())
}
