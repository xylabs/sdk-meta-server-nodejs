import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { delay } from '@xylabs/delay'
import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import type {
  NextFunction, Request, RequestHandler, Response,
} from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { RouteMatcher } from '../../lib/index.js'
import {
  createGlobMatcher,
  getUriBehindProxy,
} from '../../lib/index.js'
import type { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types/index.ts'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const defaultMaxAge = 60 * 10
const defaultCacheControlHeader = `public, max-age=${defaultMaxAge}`

const proxyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uri = getUriBehindProxy(req)
    console.log(`[proxyExternal][proxyHandler][${uri}]: called`)
    await delay(1)
    console.log(`[proxyExternal][proxyHandler][${uri}]: awaiting image`)
    const result = '{}'
    if (result) {
      console.log(`[proxyExternal][proxyHandler][${uri}]: returning image`)
      res.type('png').set('Cache-Control', defaultCacheControlHeader).send(Buffer.from(result))
    } else {
      console.log(`[proxyExternal][proxyHandler][${uri}]: returning ${ReasonPhrases.GATEWAY_TIMEOUT}}`)
      res.sendStatus(StatusCodes.GATEWAY_TIMEOUT)
    }
    return
  } catch (error) {
    console.log(error)
  }
  next()
}

const getProxyExternalPageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware | undefined => {
  const { baseDir } = opts
  const filePath = Path.join(baseDir, 'xy.config.json')
  console.log(`[proxyExternal][init] Locating xy.config.json at ${filePath}`)
  if (existsSync(filePath)) {
    console.log('[proxyExternal][init] Located xy.config.json')
    // Read in config file
    console.log('[proxyExternal][init] Parsing xy.config.json')
    const xyConfig = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }))
    console.log('[proxyExternal][init] Parsed xy.config.json')
    // TODO: Validate xyConfig
    if (xyConfig.proxyExternal) {
      console.log('[proxyExternal][init] Creating proxy handler')
      const { include, exclude } = xyConfig.proxyExternal
      const matchesIncluded: RouteMatcher = include ? createGlobMatcher(include) : () => true
      const matchesExcluded: RouteMatcher = exclude ? createGlobMatcher(exclude) : () => false

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      const proxyExternalPageHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        const uri = req.originalUrl
        if (matchesIncluded(uri) && !matchesExcluded(uri)) {
          await proxyHandler(req, res, next)
        } else {
          next()
        }
      }
      console.log('[proxyExternal][init] Created page handler')
      return ['get', ['/*', asyncHandler(proxyExternalPageHandler)]]
    }
    return undefined
  }
}

/**
 * Middleware for proxying call to external origin
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const proxyExternalImageHandler = (): MountPathAndMiddleware => ['get', ['*', asyncHandler(proxyHandler)]]

export const proxyExternalHandlers = (opts: ApplicationMiddlewareOptions) => [getProxyExternalPageHandler(opts), proxyExternalImageHandler()].filter(exists)
