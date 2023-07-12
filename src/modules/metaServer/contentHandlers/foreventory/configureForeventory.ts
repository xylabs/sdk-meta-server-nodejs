import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { mergeDocumentHead } from '@xyo-network/sdk-meta'
import { RequestHandler } from 'express'
import { existsSync, readFileSync } from 'fs'
import { extname, join } from 'path'

import { getAdjustedPath, getUriBehindProxy } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { getImageCache, usePageMetaWithImage } from './lib'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`
const imageCache = getImageCache()

const getPageHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const indexHtml = readFileSync(filePath, { encoding: 'utf-8' })

  const pageHandler = asyncHandler(async (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (extname(adjustedPath) === '.html') {
      try {
        const uri = getUriBehindProxy(req)
        console.log(`[foreventory][${uri}]: handling`)
        const routeHtml = await usePageMetaWithImage(uri, imageCache)
        console.log(`[foreventory][${uri}]: obtained html/image`)
        if (routeHtml) {
          console.log(`[foreventory][${uri}]: merging meta`)
          const updatedHtml = mergeDocumentHead(indexHtml, routeHtml)
          console.log(`[foreventory][${uri}]: responding`)
          res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updatedHtml)
          return
        }
      } catch (error) {
        console.error(error)
      }
    }
    next()
  })
  return pageHandler
}

const imageHandler: RequestHandler = (req, res, next) => {
  try {
    const image = imageCache.get(req.originalUrl)
    if (image) {
      res.type('png').set('Cache-Control', indexHtmlCacheControlHeader).send(image)
      return
    }
  } catch (error) {
    console.error(error)
  }
  next()
}

/**
 * Middleware for augmenting HTML metadata for Foreventory shares
 */
export const foreventoryPageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware => [
  'get',
  ['/netflix/insights/:hash', getPageHandler(opts.baseDir)],
]
export const foreventoryImageHandler = (): MountPathAndMiddleware => ['get', ['/netflix/insights/:hash/preview/:width/:height', imageHandler]]
