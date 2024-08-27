import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { IdLogger } from '@xylabs/logger'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { HttpStatusCode } from 'axios'
import type {
  NextFunction, Request, RequestHandler, Response,
} from 'express'

import type {
  RepositoryFile,
  RouteMatcher,
} from '../../lib/index.js'
import {
  arrayBufferToString,
  createGlobMatcher,
  getAdjustedPath,
  getUriBehindProxy,
  MemoryFileRepository,
  stringToArrayBuffer,
} from '../../lib/index.js'
import type { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types/index.ts'
import { useIndexAndDynamicPreviewImage } from './lib/index.ts'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`

const enableCaching = false

const getPageHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = Path.join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const indexHtml = readFileSync(filePath, { encoding: 'utf8' })
  const pageRepository = new MemoryFileRepository()

  const pageHandler = async (req: Request, res: Response, next: NextFunction) => {
    const adjustedPath = getAdjustedPath(req)
    if (Path.extname(adjustedPath) === '.html') {
      const uri = getUriBehindProxy(req)
      const logger = new IdLogger(console, () => `dynamicShare|pageHandler|${uri}`)
      try {
        logger.log('called')
        if (enableCaching) {
          logger.log('checking for cached')
          const cachedHtml = await pageRepository.findFile(adjustedPath)
          if (cachedHtml) {
            logger.log('return cached')
            const html = arrayBufferToString(await cachedHtml.data)
            res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(html)
            return
          }
        }
        logger.log('rendering')
        const updatedHtml = await useIndexAndDynamicPreviewImage(uri, indexHtml)
        logger.log('setting')
        if (enableCaching) {
          logger.log('caching')
          const data = stringToArrayBuffer(updatedHtml)
          const file: RepositoryFile = {
            data, type: 'text/html', uri: adjustedPath,
          }
          await pageRepository.addFile(file)
        }
        logger.log('return html')
        res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updatedHtml)
        return
      } catch (error) {
        const status = HttpStatusCode.ServiceUnavailable
        logger.log(`error, returning status code ${status}`)
        logger.log(error)
        res.status(status)
          .set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
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
  const filePath = Path.join(baseDir, 'xy.config.json')
  const logger = new IdLogger(console, () => 'dynamicShare|init')
  logger.log(`Locating xy.config.json at ${filePath}`)
  if (existsSync(filePath)) {
    logger.log('Located xy.config.json')
    // Read in config file
    logger.log('Parsing xy.config.json')
    const xyConfig = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }))
    logger.log('Parsed xy.config.json')
    // TODO: Validate xyConfig
    if (xyConfig.dynamicShare) {
      logger.log('Creating page handler')
      // TODO: Support custom done loading flag from xyConfig (or use default)
      const { include, exclude } = xyConfig.dynamicShare
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
}

/**
 * Middleware for augmenting HTML metadata for Live Shares
 */

export const dynamicShareHandlers = (opts: ApplicationMiddlewareOptions) => [getDynamicSharePageHandler(opts)].filter(exists)
