import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/express'
import Axios, { isAxiosError } from 'axios'
import type {
  NextFunction, Request, RequestHandler, Response,
} from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type { MetaServerConfig, XyConfig } from '../../../../model/index.ts'
import type { RouteMatcher } from '../../lib/index.js'
import {
  createGlobMatcher,
  getUriBehindProxy,
  loadXyConfig,
} from '../../lib/index.js'
import type { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types/index.ts'

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
      console.log(`[proxyExternal][proxyHandler][${proxyUri}]: fetched [${result.status}]`)
      if (result) {
        console.log(`[proxyExternal][proxyHandler][${proxyUri}]: returning result`)
        res.type((result.headers['Content-Type'] ?? 'html') as string).setHeaders(
          new Map(Object.entries(result.headers)),
        ).status(200).send(result.data)
        console.log(`[proxyExternal][proxyHandler][${proxyUri}]: success: ${result.status}`)
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

const proxyExternalConfig = (config: XyConfig = {}): MetaServerConfig['proxyExternal'] => {
  // eslint-disable-next-line sonarjs/deprecation
  if (config?.proxyExternal) {
    console.warn('Using deprecated proxyExternal config. Please use metaServer.proxyExternal instead.')
  }

  // eslint-disable-next-line sonarjs/deprecation
  return config?.metaServer?.proxyExternal ?? { pathFilters: config?.proxyExternal } ?? { pathFilters: {} }
}

const getProxyExternalPageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware | undefined => {
  const { baseDir } = opts
  const xyConfig = loadXyConfig(baseDir, 'proxyExternal')
  const peConfig = proxyExternalConfig(xyConfig)
  // TODO: Validate xyConfig
  if (peConfig) {
    for (let [domain, domainConfig] of Object.entries(peConfig.pathFilters ?? {})) {
      const { include = [], exclude = [] } = domainConfig
      const matchesIncluded: RouteMatcher = include.length > 0 ? createGlobMatcher(include) : () => false
      const matchesExcluded: RouteMatcher = exclude.length > 0 ? createGlobMatcher(exclude) : () => false

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

/**
 * Middleware for proxying call to external origin
 */

export const proxyExternalHandlers = (opts: ApplicationMiddlewareOptions) => [getProxyExternalPageHandler(opts)].filter(exists)
