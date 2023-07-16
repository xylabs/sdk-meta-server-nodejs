import { assertEx } from '@xylabs/assert'
import { asyncHandler, Empty, NoReqParams, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { mergeDocumentHead } from '@xyo-network/sdk-meta'
import { RequestHandler } from 'express'
import { existsSync, readFileSync } from 'fs'
import { StatusCodes } from 'http-status-codes'
import { LRUCache } from 'lru-cache'
import { join } from 'path'
import serveStatic, { ServeStaticOptions } from 'serve-static'

import { getAdjustedPath, isHtmlLike } from '../../lib'
import { MetaCacheLocals } from '../../middleware'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { exists } from './lib'

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
  index: 'index.html',
  maxAge,
}

const existingPaths = new LRUCache<string, boolean>({ max: 1000 })

const getHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const html = readFileSync(filePath, { encoding: 'utf-8' })
  const proxy = serveStatic(baseDir, options)
  const serveIndex: RequestHandler<NoReqParams, Empty, Empty, NoReqQuery, MetaCacheLocals> = (req, res, _next) => {
    let updated = html
    const path = getAdjustedPath(req)
    const updatedHead = res?.locals?.metaCache?.get?.(path)
    if (updatedHead) {
      updated = mergeDocumentHead(html, updatedHead)
    }
    res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updated)
  }
  const handler: RequestHandler<NoReqParams, Empty, Empty, NoReqQuery, MetaCacheLocals> = async (req, res, next) => {
    try {
      // Check if file exists on disk (cache check for performance)
      const file = getAdjustedPath(req)
      console.log(`[proxyOriginal][pageHandler][${file}]: called`)
      let pathExists = existingPaths.get(file)
      if (pathExists === undefined) {
        console.log(`[proxyOriginal][pageHandler][${file}]: path not cached`)
        const result = await exists(join(baseDir, file))
        console.log(`[proxyOriginal][pageHandler][${file}]: cache path`)
        existingPaths.set(file, result)
        pathExists = result
      }
      if (pathExists) {
        console.log(`[proxyOriginal][pageHandler][${file}]: proxy path`)
        proxy(req, res, next)
      } else {
        if (isHtmlLike(req)) {
          console.log(`[proxyOriginal][pageHandler][${file}]: serve index`)
          serveIndex(req, res, next)
        } else {
          res.sendStatus(StatusCodes.NOT_FOUND)
        }
      }
    } catch (error) {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
  return asyncHandler(handler) as unknown as RequestHandler
}

/**
 * Middleware to proxy the original response without any modification
 */
export const configureProxyOriginal = <T extends ApplicationMiddlewareOptions>(opts: T): MountPathAndMiddleware => [
  'get',
  ['*', getHandler(opts.baseDir)],
]
