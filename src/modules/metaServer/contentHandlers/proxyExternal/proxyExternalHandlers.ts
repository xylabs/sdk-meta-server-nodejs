import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import Axios, { isAxiosError } from 'axios'
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

interface ProxyExternalDomainConfig {
  exclude?: string[]
  include?: string[]
}

type ProxyExternalConfig = Record<string, ProxyExternalDomainConfig>

const proxyHandler = async (req: Request, res: Response, next: NextFunction, origin: string) => {
  try {
    const uri = getUriBehindProxy(req)
    console.log(`[proxyExternal][proxyHandler][${uri}]: called`)
    const uriObj = new URL(uri)
    const originObj = new URL(origin)
    uriObj.host = originObj.host
    uriObj.port = originObj.port
    uriObj.protocol = originObj.protocol ?? uriObj.protocol
    const proxyUri = uriObj.toString()
    try {
      console.log(`[proxyExternal][proxyHandler][${proxyUri}]: fetching`)
      const result = await Axios.get(proxyUri)
      console.log(`[proxyExternal][proxyHandler][${proxyUri}]: fetched [${result.data}]`)
      if (result) {
        console.log(`[proxyExternal][proxyHandler][${proxyUri}]: returning result`)
        res.type((result.headers['Content-Type'] ?? 'html') as string).setHeaders(
          new Map(Object.entries(result.headers)),
        ).status(200).send(result.data)
        console.log(`[proxyExternal][proxyHandler][${proxyUri}]: success: ${result.data}`)
      } else {
        console.log(`[proxyExternal][proxyHandler][${uri}]: returning ${ReasonPhrases.GATEWAY_TIMEOUT}}`)
        res.sendStatus(StatusCodes.GATEWAY_TIMEOUT)
      }
    } catch (ex) {
      if (isAxiosError(ex)) {
        console.log(`[proxyExternal][proxyHandler][${uri}]: excepted ${ex}`)
        res.sendStatus(StatusCodes.BAD_GATEWAY)
      }
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
    // Read in config file
    const xyConfig = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }))
    // TODO: Validate xyConfig
    if (xyConfig.proxyExternal) {
      const proxyExternalConfig = xyConfig.proxyExternal as ProxyExternalConfig
      for (let [domain, domainConfig] of Object.entries(proxyExternalConfig)) {
        const { include, exclude } = domainConfig
        const matchesIncluded: RouteMatcher = include ? createGlobMatcher(include) : () => true
        const matchesExcluded: RouteMatcher = exclude ? createGlobMatcher(exclude) : () => false

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        const proxyExternalPageHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
          const uri = req.originalUrl
          if (matchesIncluded(uri) && !matchesExcluded(uri)) {
            await proxyHandler(req, res, next, domain)
          } else {
            next()
          }
        }
        console.log('[proxyExternal][init] Created page handler')
        return ['get', ['/*', asyncHandler(proxyExternalPageHandler)]]
      }
    }
    return undefined
  }
}

/**
 * Middleware for proxying call to external origin
 */

export const proxyExternalHandlers = (opts: ApplicationMiddlewareOptions) => [getProxyExternalPageHandler(opts)].filter(exists)
