import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { assertEx } from '@xylabs/assert'
import { delay } from '@xylabs/delay'
import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import type {
  NextFunction, Request, RequestHandler, Response,
} from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import type {
  RepositoryFile,
  RouteMatcher,
} from '../../lib/index.js'
import {
  arrayBufferToString,
  createGlobMatcher,
  getAdjustedPath,
  getFileRepository,
  getUriBehindProxy,
  loadXyConfig,
  MemoryFileRepository,
  stringToArrayBuffer,
} from '../../lib/index.js'
import type { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types/index.ts'
import {
  ensureImageExists, getPageUrlFromImageUrl, useIndexAndDeferredPreviewImage,
} from './lib/index.ts'

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
const enableCaching = true

const getPageHandler = (baseDir: string) => {
  // Ensure file containing base HTML exists
  const filePath = Path.join(baseDir, 'index.html')
  assertEx(existsSync(filePath), () => 'Missing index.html')
  const indexHtml = readFileSync(filePath, { encoding: 'utf8' })
  const pageRepository = new MemoryFileRepository()

  const pageHandler = async (req: Request, res: Response, next: NextFunction) => {
    const adjustedPath = getAdjustedPath(req)
    if (Path.extname(adjustedPath) === '.html') {
      try {
        const uri = getUriBehindProxy(req)
        console.log(`[liveShare][pageHandler][${uri}]: called`)
        if (enableCaching) {
          console.log(`[liveShare][pageHandler][${uri}]: checking for cached`)
          const cachedHtml = await pageRepository.findFile(adjustedPath)
          if (cachedHtml) {
            console.log(`[liveShare][pageHandler][${uri}]: return cached`)
            const html = arrayBufferToString(await cachedHtml.data)
            res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(html)
            return
          }
        }
        console.log(`[liveShare][pageHandler][${uri}]: rendering`)
        const updatedHtml = useIndexAndDeferredPreviewImage(uri, imageRepository(), indexHtml)
        console.log(`[liveShare][pageHandler][${uri}]: caching`)
        const data = stringToArrayBuffer(updatedHtml)
        const file: RepositoryFile = {
          data, type: 'text/html', uri: adjustedPath,
        }
        await pageRepository.addFile(file)
        console.log(`[liveShare][pageHandler][${uri}]: return html`)
        res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updatedHtml)
        return
      } catch (error) {
        console.log(error)
      }
    }
    next()
  }
  return pageHandler
}

const imageHandler = async (req: Request, res: Response, next: NextFunction) => {
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
}

const getLiveSharePageHandler = (opts: ApplicationMiddlewareOptions): MountPathAndMiddleware | undefined => {
  const { baseDir } = opts
  const xyConfig = loadXyConfig(baseDir, 'liveShare')
  // TODO: Validate xyConfig
  if (xyConfig?.liveShare) {
    console.log('[liveShare][init] Initialize repository')
    imageRepository()
    console.log('[liveShare][init] Initialized repository')
    console.log('[liveShare][init] Creating page handler')
    const { include, exclude } = xyConfig.liveShare
    const matchesIncluded: RouteMatcher = include ? createGlobMatcher(include) : () => true
    const matchesExcluded: RouteMatcher = exclude ? createGlobMatcher(exclude) : () => false
    const pageHandler = getPageHandler(baseDir)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const liveSharePageHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
      // Exclude query string from glob via req.path
      const uri = req.path
      const render = req.params?.render
      // // NOTE: Uncomment if we want to also include query string
      // const uri = req.originalUrl
      if (render !== 'preview' && matchesIncluded(uri) && !matchesExcluded(uri)) {
        // TODO: Better way to determine page vs image handler
        await (uri.endsWith('img.png') ? imageHandler(req, res, next) : pageHandler(req, res, next))
      } else {
        next()
      }
    }
    console.log('[liveShare][init] Created page handler')
    return ['get', ['/*', asyncHandler(liveSharePageHandler)]]
  }
  return undefined
}

/**
 * Middleware for augmenting HTML metadata for Live Shares
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
const liveShareImageHandler = (): MountPathAndMiddleware => ['get', ['*/preview/:width/:height/img.png', asyncHandler(imageHandler)]]

export const liveShareHandlers = (opts: ApplicationMiddlewareOptions) => [getLiveSharePageHandler(opts), liveShareImageHandler()].filter(exists)
