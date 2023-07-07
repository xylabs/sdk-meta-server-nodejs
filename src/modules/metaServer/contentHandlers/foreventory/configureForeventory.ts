import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { LRUCache } from 'lru-cache'
import { extname } from 'path'

import { getAdjustedPath, getUriBehindProxy } from '../../lib'
import { MountPathAndMiddleware } from '../../types'
import { ImageCache } from './ImageCache'
import { usePageMetaWithImage } from './lib'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`

const images = new LRUCache<string, Buffer>({ max: 1000 })

const ALLOW_FOREVENTORY_HANDLER = false

const getHandler = (): RequestHandler => {
  if (!ALLOW_FOREVENTORY_HANDLER) return (_req, _res, next) => next()

  return asyncHandler(async (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (extname(adjustedPath) === '.html') {
      try {
        const uri = getUriBehindProxy(req)
        const updatedHtml = await usePageMetaWithImage(uri, images)
        res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updatedHtml)
        return
      } catch (error) {
        console.log(error)
      }
    }
    next()
  })
}

/**
 * Middleware for augmenting HTML metadata for Foreventory shares
 */
export const configureForeventory = (): MountPathAndMiddleware => ['get', ['/:provider/:hash/share', getHandler()]]
