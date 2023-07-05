import { Express } from 'express'

import { configureArchivistBlock, configureForeventory, configureProxyOriginal } from '../contentHandlers'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../types'

export const addContentHandlers = (app: Express, opts: ApplicationMiddlewareOptions) => {
  const knownRequestTypeHandlers: MountPathAndMiddleware[] = [
    // Explore/Node handlers
    configureArchivistBlock(opts),
    // Foreventory handlers
    configureForeventory(opts),
  ]
  // Add catch-all pass-through handler last to ensure
  // all unknown/unsupported requests are simply proxied
  knownRequestTypeHandlers.push(configureProxyOriginal(opts))
  for (const handler of knownRequestTypeHandlers) {
    app[handler[0]](...handler[1])
  }
}
