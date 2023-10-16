import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { existsSync, readFileSync } from 'fs'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { makeRe, MMRegExp } from 'minimatch'
import { extname, join } from 'path'

import { getAdjustedPath, getUriBehindProxy, preCacheFacebookShare } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { getImageCache, getPageCache, getPagePreviewImage, getPageUrlFromImageUrl, useIndexAndDeferredPreviewImage } from './lib'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`
/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const imageMaxAge = 60 * 10
const imageCacheControlHeader = `public, max-age=${imageMaxAge}`

/**
 * How often to poll for the completion of image generation
 */
const imageGenerationCompletionPollingInterval = 100
/**
 * The maximum amount of time to wait for image generation
 */
const maxImageGenerationWait = 8000

const imageCache = getImageCache()

/**
 * Function which checks if a route matches any of the included glob patterns
 */
type RouteMatcher = (route: string) => boolean

/**
 * Higher order function which creates precompiled RegEx matchers
 * from a list of Glob Patterns
 * @param patterns Glob patterns for route paths to match against
 * @returns
 */
const createMatcher = (patterns: string[]): RouteMatcher => {
  const regexesOrFalse = patterns.map((pattern) => makeRe(pattern))
  const regexes = regexesOrFalse.filter((regex): regex is MMRegExp => assertEx(regex !== false, 'Invalid glob pattern'))
  return (route: string) => regexes.some((regex) => regex.test(route))
}

const getPageHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const indexHtml = readFileSync(filePath, { encoding: 'utf-8' })
  const pageCache = getPageCache()

  const pageHandler: RequestHandler = asyncHandler(async (req, res, next) => {
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
          const updatedHtml = useIndexAndDeferredPreviewImage(uri, imageCache, indexHtml)
          console.log(`[foreventory][pageHandler][${uri}]: caching`)
          pageCache.set(uri, updatedHtml)
          console.log(`[foreventory][pageHandler][${uri}]: pre-caching social media share image`)
          await preCacheFacebookShare(uri)
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

const imageHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const uri = getUriBehindProxy(req)
    console.log(`[foreventory][imageHandler][${uri}]: called`)
    let imageTask = imageCache.get(uri)
    if (!imageTask) {
      console.log(`[foreventory][imageHandler][${uri}]: generating image`)
      // Render the page and generate the image
      const pageUrl = getPageUrlFromImageUrl(uri)
      getPagePreviewImage(pageUrl, imageCache)
      let imageGenerationWait = 0
      do {
        await delay(imageGenerationCompletionPollingInterval)
        imageGenerationWait += imageGenerationCompletionPollingInterval
        imageTask = imageCache.get(uri)
      } while (imageTask === undefined && imageGenerationWait < maxImageGenerationWait)
    }
    console.log(`[foreventory][imageHandler][${uri}]: awaiting image generation`)
    const image = await imageTask
    if (image) {
      console.log(`[foreventory][imageHandler][${uri}]: returning image`)
      res.type('png').set('Cache-Control', imageCacheControlHeader).send(image)
    } else {
      console.log(`[foreventory][imageHandler][${uri}]: returning ${ReasonPhrases.GATEWAY_TIMEOUT}}`)
      res.sendStatus(StatusCodes.GATEWAY_TIMEOUT)
    }
    return
  } catch (error) {
    console.log(error)
  }
  next()
})

const liveShareHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware | undefined => {
  const { baseDir } = opts
  const filePath = join(baseDir, 'xy.config.json')
  if (existsSync(filePath)) {
    // Read in config file
    const xyConfig = JSON.parse(readFileSync(filePath, { encoding: 'utf-8' }))
    // TODO: Validate xyConfig
    if (xyConfig.liveShare) {
      const { include, exclude } = xyConfig.liveShare
      const matchesIncluded: RouteMatcher = include ? createMatcher(include) : () => true
      const matchesExcluded: RouteMatcher = exclude ? createMatcher(exclude) : () => false

      const handler: RequestHandler = asyncHandler(async (req, res, next) => {
        const adjustedPath = getAdjustedPath(req)
        await Promise.resolve()
        if (matchesIncluded(adjustedPath) && !matchesExcluded(adjustedPath)) {
          // TODO: Grab helmet head data, next for now
          next()
        } else {
          next()
        }
      })
      return ['get', ['/*', handler]]
    }
    return undefined
  }
}

/**
 * Middleware for augmenting HTML metadata for Foreventory shares
 */
const foreventorySharePageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware => [
  'get',
  ['/netflix/insights/:hash', getPageHandler(opts.baseDir)],
]
const foreventoryImageHandler = (): MountPathAndMiddleware => ['get', ['/netflix/insights/:hash/preview/:width/:height/img.png', imageHandler]]

export const foreventoryHandlers = (opts: ApplicationMiddlewareOptions) =>
  [foreventorySharePageHandler(opts), foreventoryImageHandler(), liveShareHandler(opts)].filter(exists)
