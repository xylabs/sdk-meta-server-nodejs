import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { metaBuilder } from '@xyo-network/sdk-meta'
import { RequestHandler } from 'express'
import { existsSync, readFileSync } from 'fs'
import { extname, join } from 'path'

import { getAdjustedPath, getUriBehindProxy } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { getImageCache, getPageCache, getPreviewAsImage as getPagePreviewAsImage, getPreviewMeta, getRenderedPageAsImage } from './lib'

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
  const pageCache = getPageCache()

  const pageHandler = asyncHandler(async (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (extname(adjustedPath) === '.html') {
      try {
        const uri = getUriBehindProxy(req)
        console.log(`[foreventory][pageHandler][${uri}]: called`)
        const cachedHtml = pageCache.get(uri)
        if (cachedHtml) {
          console.log(`[foreventory][pageHandler][${uri}]: return cached`)
          res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(cachedHtml)
          return
        } else {
          console.log(`[foreventory][pageHandler][${uri}]: rendering`)
          await getPagePreviewAsImage(uri, imageCache)
          console.log(`[foreventory][pageHandler][${uri}]: merging`)
          const updatedHtml = metaBuilder(indexHtml, getPreviewMeta(uri))
          console.log(`[foreventory][pageHandler][${uri}]: caching`)
          pageCache.set(uri, updatedHtml)
          console.log(`[foreventory][pageHandler][${uri}]: return html`)
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

const imageHandler: RequestHandler = (req, res, next) => {
  try {
    const uri = getUriBehindProxy(req)
    const image = imageCache.get(uri)
    if (image) {
      res.type('png').set('Cache-Control', indexHtmlCacheControlHeader).send(image)
      return
    }
  } catch (error) {
    console.log(error)
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
export const foreventoryImageHandler = (): MountPathAndMiddleware => ['get', ['/netflix/insights/:hash/preview/:width/:height/img.png', imageHandler]]
