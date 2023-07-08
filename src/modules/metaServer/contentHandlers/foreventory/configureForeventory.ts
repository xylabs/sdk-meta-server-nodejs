import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { extname } from 'path'

import { getAdjustedPath, getUriBehindProxy } from '../../lib'
import { MountPathAndMiddleware } from '../../types'
import { getImageCache, usePageMetaWithImage } from './lib'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`
const imageCache = getImageCache()

const pageHandler = asyncHandler(async (req, res, next) => {
  const adjustedPath = getAdjustedPath(req)
  if (extname(adjustedPath) === '.html') {
    try {
      const uri = getUriBehindProxy(req)
      const updatedHtml = await usePageMetaWithImage(uri, imageCache)
      res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updatedHtml)
      return
    } catch (error) {
      console.log(error)
    }
  }
  next()
})

const imageHandler: RequestHandler = (req, res, next) => {
  try {
    const image = imageCache.get(req.originalUrl)
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
export const foreventoryPageHandler = (): MountPathAndMiddleware => ['get', ['/netflix/insights/:hash/share', pageHandler]]
export const foreventoryImageHandler = (): MountPathAndMiddleware => ['get', ['/netflix/insights/:hash/share/:width/:height', imageHandler]]
