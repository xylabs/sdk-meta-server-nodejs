import { assertEx } from '@xylabs/assert'
import { RequestHandler } from 'express'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import serveStatic, { ServeStaticOptions } from 'serve-static'

import { getAdjustedPath, isKnownFileExtension } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'

const oneDayInMs = 1000 * 60 * 60 * 24

const options: ServeStaticOptions = {
  cacheControl: true,
  // etag: true,
  fallthrough: false,
  maxAge: oneDayInMs,
}

const getHandler = (baseDir: string) => {
  // If file containing standard HTML meta exists use it otherwise use defaults
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const html = readFileSync(filePath, { encoding: 'utf-8' })
  const proxy = serveStatic(baseDir, options)
  const handler: RequestHandler = (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (isKnownFileExtension(adjustedPath)) {
      proxy(req, res, next)
    } else {
      res.set('Cache-Control', `public, max-age=${oneDayInMs}`).send(html)
    }
  }
  return handler
}

/**
 * Middleware to proxy the original response without any modification
 */
export const configureProxyOriginal = <T extends ApplicationMiddlewareOptions>(opts: T): MountPathAndMiddleware => [
  'get',
  ['*', getHandler(opts.baseDir)],
]
