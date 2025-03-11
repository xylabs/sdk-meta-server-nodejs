import {
  customPoweredByHeader, disableCaseSensitiveRouting, disableExpressDefaultPoweredByHeader,
} from '@xylabs/sdk-api-express-ecs'
import type { Express } from 'express'

import { globalDefaultCaching, metaCache } from '../middleware/index.ts'

export const addMiddleware = (app: Express) => {
  app.use(globalDefaultCaching)
  app.set('etag', false)
  disableExpressDefaultPoweredByHeader(app)
  app.use(customPoweredByHeader)
  disableCaseSensitiveRouting(app)
  app.use(metaCache())
}
