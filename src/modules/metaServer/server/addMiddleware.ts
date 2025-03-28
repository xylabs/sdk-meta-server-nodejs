import {
  customPoweredByHeader, disableCaseSensitiveRouting, disableExpressDefaultPoweredByHeader,
} from '@xylabs/express'
import type { Express } from 'express'

import { getGlobalDefaultCaching, metaCache } from '../middleware/index.ts'

export const addMiddleware = (app: Express, baseDir: string) => {
  app.use(getGlobalDefaultCaching(baseDir))
  app.set('etag', false)
  disableExpressDefaultPoweredByHeader(app)
  app.use(customPoweredByHeader)
  disableCaseSensitiveRouting(app)
  app.use(metaCache())
}
