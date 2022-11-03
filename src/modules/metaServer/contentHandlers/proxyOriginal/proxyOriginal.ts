import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { existsSync, readFileSync } from 'fs'
import { StatusCodes } from 'http-status-codes'
import LruCache from 'lru-cache'
import { join } from 'path'
import serveStatic, { ServeStaticOptions } from 'serve-static'

import { getAdjustedPath } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { isFile } from './isFile'

/**
 * The max-age cache control header time (in seconds)
 * to set for the index.html file
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`

/**
 * The max-age cache control header time (in mS)
 * to set for static files other than index.html
 */
const maxAge = 60 * 60 * 1000

const options: ServeStaticOptions = {
  cacheControl: true,
  // etag: true,
  fallthrough: false,
  maxAge,
}

const existingFiles = new LruCache<string, boolean>({ max: 1000 })

const getHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const html = readFileSync(filePath, { encoding: 'utf-8' })
  const proxy = serveStatic(baseDir, options)
  const serveIndex: RequestHandler = (_req, res, _next) => res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(html)
  const proxyIfExists = (req: Request, res: Response, next: NextFunction, exists: boolean) => {
    if (exists) {
      proxy(req, res, next)
    } else {
      serveIndex(req, res, next)
    }
  }
  const handler: RequestHandler = async (req, res, next) => {
    const file = getAdjustedPath(req)
    try {
      // Check if file exists on disk and proxy
      const cachedResult = existingFiles.get(file)
      if (cachedResult !== undefined) {
        proxyIfExists(req, res, next, cachedResult)
      } else {
        const exists = await isFile(join(baseDir, file))
        existingFiles.set(file, exists)
        proxyIfExists(req, res, next, exists)
      }
    } catch (error) {
      // We got here because
      if (file.endsWith('.html')) {
        serveIndex(req, res, next)
      } else {
        res.sendStatus(StatusCodes.NOT_FOUND)
      }
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
