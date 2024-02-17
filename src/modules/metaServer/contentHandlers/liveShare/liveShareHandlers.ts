import { existsSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'

import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  arrayBufferToString,
  createGlobMatcher,
  getAdjustedPath,
  getFileRepository,
  getUriBehindProxy,
  MemoryFileRepository,
  RepositoryFile,
  RouteMatcher,
  stringToArrayBuffer,
} from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { ensureImageExists, getPageUrlFromImageUrl, useIndexAndDeferredPreviewImage } from './lib'

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`
/**
 * The max-age cache control header time (in seconds)
 * to set for image files
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

/**
 * Repository used for caching generated images.
 * NOTE: This is lazy loaded to allow for the
 * environment to be initialized before the
 * repository is created. Code bundling and
 * async loading of ENV from AWS can cause
 * issues if the repository is created before
 * the environment is fully initialized.
 */
const imageRepository = () => getFileRepository()
const disableCaching = false

const getPageHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const indexHtml = readFileSync(filePath, { encoding: 'utf8' })
  const pageRepository = new MemoryFileRepository()

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const pageHandler: RequestHandler = asyncHandler(async (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (extname(adjustedPath) === '.html') {
      try {
        const uri = getUriBehindProxy(req)
        console.log(`[liveShare][pageHandler][${uri}]: called`)
        const cachedHtml = await pageRepository.findFile(adjustedPath)
        if (cachedHtml && !disableCaching) {
          console.log(`[liveShare][pageHandler][${uri}]: return cached`)
          const html = arrayBufferToString(await cachedHtml.data)
          res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(html)
          return
        } else {
          console.log(`[liveShare][pageHandler][${uri}]: rendering`)
          const updatedHtml = useIndexAndDeferredPreviewImage(uri, imageRepository(), indexHtml)
          console.log(`[liveShare][pageHandler][${uri}]: caching`)
          const data = stringToArrayBuffer(updatedHtml)
          const file: RepositoryFile = { data, type: 'text/html', uri: adjustedPath }
          await pageRepository.addFile(file)
          console.log(`[liveShare][pageHandler][${uri}]: return html`)
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

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const imageHandler: RequestHandler = asyncHandler(async (req, res, next) => {
  try {
    const uri = getUriBehindProxy(req)
    console.log(`[liveShare][imageHandler][${uri}]: called`)
    let imageTask = await imageRepository().findFile(uri)
    // TODO: We can just return a 404 if the image doesn't exist
    // once we're happy with the persistence-backed caching
    if (!imageTask) {
      console.log(`[liveShare][imageHandler][${uri}]: generating image`)
      // Render the page and generate the image
      const pageUrl = getPageUrlFromImageUrl(uri)
      ensureImageExists(pageUrl, imageRepository())
      let imageGenerationWait = 0
      do {
        await delay(imageGenerationCompletionPollingInterval)
        imageGenerationWait += imageGenerationCompletionPollingInterval
        imageTask = await imageRepository().findFile(uri)
      } while (imageTask === undefined && imageGenerationWait < maxImageGenerationWait)
    }
    console.log(`[liveShare][imageHandler][${uri}]: awaiting image`)
    const image = await imageTask?.data
    if (image) {
      console.log(`[liveShare][imageHandler][${uri}]: returning image`)
      res.type('png').set('Cache-Control', imageCacheControlHeader).send(Buffer.from(image))
    } else {
      console.log(`[liveShare][imageHandler][${uri}]: returning ${ReasonPhrases.GATEWAY_TIMEOUT}}`)
      res.sendStatus(StatusCodes.GATEWAY_TIMEOUT)
    }
    return
  } catch (error) {
    console.log(error)
  }
  next()
})

const getLiveSharePageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware | undefined => {
  const { baseDir } = opts
  const filePath = join(baseDir, 'xy.config.json')
  console.log(`[liveShare][init] Locating xy.config.json at ${filePath}`)
  if (existsSync(filePath)) {
    console.log('[liveShare][init] Located xy.config.json')
    // Read in config file
    console.log('[liveShare][init] Parsing xy.config.json')
    const xyConfig = JSON.parse(readFileSync(filePath, { encoding: 'utf8' }))
    console.log('[liveShare][init] Parsed xy.config.json')
    // TODO: Validate xyConfig
    if (xyConfig.liveShare) {
      console.log('[liveShare][init] Initialize repository')
      imageRepository()
      console.log('[liveShare][init] Initialized repository')
      console.log('[liveShare][init] Creating page handler')
      const { include, exclude } = xyConfig.liveShare
      const matchesIncluded: RouteMatcher = include ? createGlobMatcher(include) : () => true
      const matchesExcluded: RouteMatcher = exclude ? createGlobMatcher(exclude) : () => false
      const pageHandler = getPageHandler(baseDir)
      const liveSharePageHandler: RequestHandler = (req, res, next) => {
        // Exclude query string from glob via req.path
        const uri = req.path
        const render = req.params?.render
        // // NOTE: Uncomment if we want to also include query string
        // const uri = req.originalUrl
        if (render !== 'preview' && matchesIncluded(uri) && !matchesExcluded(uri)) {
          // TODO: Better way to determine page vs image handler
          if (uri.endsWith('img.png')) {
            imageHandler(req, res, next)
          } else {
            pageHandler(req, res, next)
          }
        } else {
          next()
        }
      }
      console.log('[liveShare][init] Created page handler')
      return ['get', ['/*', liveSharePageHandler]]
    }
    return undefined
  }
}

/**
 * Middleware for augmenting HTML metadata for Live Shares
 */

const liveShareImageHandler = (): MountPathAndMiddleware => ['get', ['*/preview/:width/:height/img.png', imageHandler]]

export const liveShareHandlers = (opts: ApplicationMiddlewareOptions) => [getLiveSharePageHandler(opts), liveShareImageHandler()].filter(exists)
