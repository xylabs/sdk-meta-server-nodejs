import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/express'
import { IdLogger } from '@xylabs/logger'
import { HttpStatusCode } from 'axios'
import type {
  NextFunction, Request, RequestHandler, Response,
} from 'express'

import { dynamicShareCacheConfigLoader, type XyConfig } from '../../../../model/index.ts'
import type {
  RepositoryFile,
  RouteMatcher,
} from '../../lib/index.js'
import {
  arrayBufferToString,
  createGlobMatcher,
  getAdjustedPath,
  getUriBehindProxy,
  headersFromCacheConfig,
  loadXyConfig,
  MemoryFileRepository,
  stringToArrayBuffer,
} from '../../lib/index.js'
import type { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types/index.ts'
import { useIndexAndDynamicPreviewImage } from './lib/index.ts'

const enableCaching = false

const dynamicShareConfig = (config: XyConfig = {}) => {
  // eslint-disable-next-line sonarjs/deprecation
  if (config?.dynamicShare) {
    console.warn('Using deprecated dynamicShare config. Please use metaServer.dynamicShare instead.')
  }
  // eslint-disable-next-line sonarjs/deprecation
  return config?.metaServer?.dynamicShare?.pathFilter ?? config?.dynamicShare
}

const getPageHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = Path.join(baseDir, 'index.html')
  assertEx(existsSync(filePath), () => 'Missing index.html')
  const indexHtml = readFileSync(filePath, { encoding: 'utf8' })
  const pageRepository = new MemoryFileRepository()
  const xyConfig = loadXyConfig(baseDir, 'dynamicShare')

  const pageHandler = async (req: Request, res: Response, next: NextFunction) => {
    const adjustedPath = getAdjustedPath(req)
    if (Path.extname(adjustedPath) === '.html') {
      const uri = getUriBehindProxy(req)
      const logger = new IdLogger(console, () => `dynamicShare|pageHandler|${uri}`)
      try {
        logger.log('called', adjustedPath)
        if (enableCaching) {
          logger.log('checking for cached', adjustedPath)
          const cachedHtml = await pageRepository.findFile(adjustedPath)
          if (cachedHtml) {
            logger.log('return cached', adjustedPath)
            const html = arrayBufferToString(await cachedHtml.data)
            res.type('html').set(headersFromCacheConfig(dynamicShareCacheConfigLoader(xyConfig))).send(html)
            return
          }
        }
        logger.log('rendering', adjustedPath)
        const updatedHtml = await useIndexAndDynamicPreviewImage(uri, indexHtml)
        logger.log('setting', adjustedPath)
        if (enableCaching) {
          logger.log('caching', adjustedPath)
          const data = stringToArrayBuffer(updatedHtml)
          const file: RepositoryFile = {
            data, type: 'text/html', uri: adjustedPath,
          }
          await pageRepository.addFile(file)
        }
        logger.log('return html', adjustedPath)
        res.type('html').set(headersFromCacheConfig(dynamicShareCacheConfigLoader(xyConfig))).send(updatedHtml)
        return
      } catch (error) {
        const status = HttpStatusCode.ServiceUnavailable
        logger.log('error, returning status code', adjustedPath, status)
        logger.log(error)
        res.status(status)
          .set('Retry-After', '60') // Retry after 60 seconds
          .send()
        return
      }
    }
    next()
  }
  return pageHandler
}

const getDynamicSharePageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware | undefined => {
  const { baseDir } = opts
  const logger = new IdLogger(console, () => 'dynamicShare|init')
  const xyConfig = loadXyConfig(baseDir, 'dynamicShare')
  logger.log('Parsed xy.config.json')
  const dsConfig = dynamicShareConfig(xyConfig)
  // TODO: Validate xyConfig
  if (dsConfig) {
    logger.log('Creating page handler')
    // TODO: Support custom done loading flag from xyConfig (or use default)
    const { include = [], exclude = [] } = dsConfig
    const matchesIncluded: RouteMatcher = include ? createGlobMatcher(include) : () => true
    const matchesExcluded: RouteMatcher = exclude ? createGlobMatcher(exclude) : () => false
    const pageHandler = getPageHandler(baseDir)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const dynamicSharePageHandler: RequestHandler = async (req, res, next) => {
      // Exclude query string from glob via req.path
      const uri = req.path
      // // NOTE: Uncomment if we want to also include query string
      // const uri = req.originalUrl
      if (matchesIncluded(uri) && !matchesExcluded(uri)) {
        await pageHandler(req, res, next)
      } else {
        next()
      }
    }
    logger.log('Created page handler')
    return ['get', ['/*', asyncHandler(dynamicSharePageHandler)]]
  }
  return undefined
}

/**
 * Middleware for augmenting HTML metadata for Live Shares
 */

export const dynamicShareHandlers = (opts: ApplicationMiddlewareOptions) => [getDynamicSharePageHandler(opts)].filter(exists)
