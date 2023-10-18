import { Express } from 'express'

import { configureProxyOriginal, debugRoutes, foreventoryHandlers, liveShareHandlers } from '../contentHandlers'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../types'

const debugHandlers = process.env.NODE_ENV === 'development' ? debugRoutes : []

export const addContentHandlers = (app: Express, opts: ApplicationMiddlewareOptions) => {
  const knownRequestTypeHandlers: MountPathAndMiddleware[] = [
    // Debug routes
    ...debugHandlers,
    // Foreventory handlers
    ...foreventoryHandlers(opts),
    // Live Share handlers
    ...liveShareHandlers(opts),
    // Explore/Node handlers
    // configureArchivistBlock(opts),
  ]
  // Add catch-all pass-through handler last to ensure
  // all unknown/unsupported requests are simply proxied
  knownRequestTypeHandlers.push(configureProxyOriginal(opts))
  for (const handler of knownRequestTypeHandlers) {
    app[handler[0]](...handler[1])
  }
}
