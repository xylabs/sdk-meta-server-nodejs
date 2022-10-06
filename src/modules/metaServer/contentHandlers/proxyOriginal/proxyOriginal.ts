import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { existsSync, readFileSync } from 'fs'
import { stat } from 'fs/promises'
import LruCache from 'lru-cache'
import { join } from 'path'
import serveStatic, { ServeStaticOptions } from 'serve-static'

import { getAdjustedPath } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'

const oneDayInMs = 1000 * 60 * 60 * 24

const options: ServeStaticOptions = {
  cacheControl: true,
  // etag: true,
  fallthrough: false,
  maxAge: oneDayInMs,
}

const existingFiles = new LruCache<string, boolean>({ max: 1000 })

const getHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const html = readFileSync(filePath, { encoding: 'utf-8' })
  const proxy = serveStatic(baseDir, options)
  const serveIndex: RequestHandler = (_req, res, _next) => res.type('html').set('Cache-Control', `public, max-age=${oneDayInMs}`).send(html)
  const proxyIfExists = (req: Request, res: Response, next: NextFunction, exists: boolean) => {
    if (exists) {
      proxy(req, res, next)
    } else {
      serveIndex(req, res, next)
    }
  }
  const handler: RequestHandler = async (req, res, next) => {
    try {
      // Check if file exists on disk and proxy
      const file = getAdjustedPath(req)
      const cachedResult = existingFiles.get(file)
      if (cachedResult !== undefined) {
        proxyIfExists(req, res, next, cachedResult)
      } else {
        const path = join(baseDir, file)
        // NOTE: Stat throws if file doesn't exist
        const exists = (await stat(path)).isFile()
        existingFiles.set(file, exists)
        proxyIfExists(req, res, next, exists)
      }
    } catch (error) {
      serveIndex(req, res, next)
    }
  }
  return asyncHandler(handler)
}

/**
 * Middleware to proxy the original response without any modification
 */
export const configureProxyOriginal = <T extends ApplicationMiddlewareOptions>(opts: T): MountPathAndMiddleware => [
  'get',
  ['*', getHandler(opts.baseDir)],
]
