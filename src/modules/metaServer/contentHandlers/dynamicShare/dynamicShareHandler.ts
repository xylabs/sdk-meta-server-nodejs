import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { assertEx } from '@xylabs/assert'
import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import {
  arrayBufferToString,
  createGlobMatcher,
  getAdjustedPath,
  getUriBehindProxy,
  MemoryFileRepository,
  RepositoryFile,
  RouteMatcher,
  stringToArrayBuffer,
} from '../../lib/index.js'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types/index.js'
import { useIndexAndDynamicPreviewImage } from './lib/index.js'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`

const disableCaching = false

const getPageHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = Path.join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const indexHtml = readFileSync(filePath, { encoding: 'utf8' })
  const pageRepository = new MemoryFileRepository()

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const pageHandler: RequestHandler = asyncHandler(async (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (Path.extname(adjustedPath) === '.html') {
      try {
        const uri = getUriBehindProxy(req)
        console.log(`[dynamicShare][pageHandler][${uri}]: called`)
        const cachedHtml = await pageRepository.findFile(adjustedPath)
        if (cachedHtml && !disableCaching) {
          console.log(`[dynamicShare][pageHandler][${uri}]: return cached`)
          const html = arrayBufferToString(await cachedHtml.data)
          res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(html)
          return
        } else {
          console.log(`[dynamicShare][pageHandler][${uri}]: rendering`)
          const updatedHtml = await useIndexAndDynamicPreviewImage(uri, indexHtml)
          console.log(`[dynamicShare][pageHandler][${uri}]: caching`)
          const data = stringToArrayBuffer(updatedHtml)
          const file: RepositoryFile = { data, type: 'text/html', uri: adjustedPath }
          await pageRepository.addFile(file)
          console.log(`[dynamicShare][pageHandler][${uri}]: return html`)
          res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updatedHtml)
          return
        }
      } catch (error) {
        console.log(error)
      }
    }
    next()
  })
  return pageHandler
}

const getDynamicSharePageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware | undefined => {
  const { baseDir } = opts
  const filePath = Path.join(baseDir, 'xy.config.json')
  console.log(`[dynamicShare][init] Locating xy.config.json at ${filePath}`)
  if (existsSync(filePath)) {
    console.log('[dynamicShare][init] Located xy.config.json')
    // Read in config file
    console.log('[dynamicShare][init] Parsing xy.config.json')
    const xyConfig = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }))
    console.log('[dynamicShare][init] Parsed xy.config.json')
    // TODO: Validate xyConfig
    if (xyConfig.dynamicShare) {
      console.log('[dynamicShare][init] Creating page handler')
      // TODO: Support custom done loading flag from xyConfig (or use default)
      const { include, exclude } = xyConfig.dynamicShare
      const matchesIncluded: RouteMatcher = include ? createGlobMatcher(include) : () => true
      const matchesExcluded: RouteMatcher = exclude ? createGlobMatcher(exclude) : () => false
      const pageHandler = getPageHandler(baseDir)
      const dynamicSharePageHandler: RequestHandler = (req, res, next) => {
        // Exclude query string from glob via req.path
        const uri = req.path
        // // NOTE: Uncomment if we want to also include query string
        // const uri = req.originalUrl
        if (matchesIncluded(uri) && !matchesExcluded(uri)) {
          pageHandler(req, res, next)
        } else {
          next()
        }
      }
      console.log('[dynamicShare][init] Created page handler')
      return ['get', ['/*', dynamicSharePageHandler]]
    }
    return undefined
  }
}

/**
 * Middleware for augmenting HTML metadata for Live Shares
 */

export const dynamicShareHandlers = (opts: ApplicationMiddlewareOptions) => [getDynamicSharePageHandler(opts)].filter(exists)
