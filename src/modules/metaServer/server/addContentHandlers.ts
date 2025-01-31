import type { Express } from 'express'

import {
  configureProxyOriginal, debugRoutes, dynamicShareHandlers, liveShareHandlers, proxyExternalHandlers,
} from '../contentHandlers/index.ts'
import type { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../types/index.ts'

const debugHandlers = process.env.NODE_ENV === 'development' ? debugRoutes : []

export const addContentHandlers = (app: Express, opts: ApplicationMiddlewareOptions) => {
  const knownRequestTypeHandlers: MountPathAndMiddleware[] = [
    // Debug routes
    ...debugHandlers,
    ...proxyExternalHandlers(opts),
    // Dynamic Share handlers
    ...dynamicShareHandlers(opts),
    // Live Share handlers
    ...liveShareHandlers(opts),
  ]
  // Add catch-all pass-through handler last to ensure
  // all unknown/unsupported requests are simply proxied
  knownRequestTypeHandlers.push(configureProxyOriginal(opts))
  for (const handler of knownRequestTypeHandlers) {
    app[handler[0]](...handler[1])
  }
}
