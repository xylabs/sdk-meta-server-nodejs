import { assertEx } from '@xylabs/assert'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { Meta } from '@xyo-network/sdk-meta'
import { existsSync, readFileSync } from 'fs'
import { extname, join } from 'path'

import { getAdjustedPath, getUriBehindProxy } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { getPayloadInfoFromPath, isEnoughInfoToRetrievePayload, setHtmlMetaData } from './lib'

const defaultHtmlMeta: Meta = {
  description: "Own your piece of XYO's Decentralized Digital World!",
  og: {},
  title: 'XYO 2.1',
  twitter: {},
}

/**
 * The max-age cache control header time (in seconds)
 * to set for html files
 */
const indexHtmlMaxAge = 60 * 10
const indexHtmlCacheControlHeader = `public, max-age=${indexHtmlMaxAge}`

const getHandler = (baseDir: string) => {
  // If file containing standard HTML meta exists use it otherwise use defaults
  const metaPath = join(baseDir, 'meta.json')
  const htmlMeta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, { encoding: 'utf-8' })) : defaultHtmlMeta
  const filePath = join(baseDir, 'index.html')
  assertEx(existsSync(filePath), 'Missing index.html')
  const html = readFileSync(filePath, { encoding: 'utf-8' })

  return asyncHandler(async (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (extname(adjustedPath) === '.html') {
      try {
        const uri = getUriBehindProxy(req)
        const info = getPayloadInfoFromPath(uri)
        if (isEnoughInfoToRetrievePayload(info)) {
          const updatedHtml = await setHtmlMetaData(info, html, htmlMeta)
          res.type('html').set('Cache-Control', indexHtmlCacheControlHeader).send(updatedHtml)
          return
        }
      } catch (error) {
        console.log(error)
      }
    }
    next()
  })
}

// NOTE: Since we're really doing a form of templating in that we're replacing response values dynamically,
// it might be more advantageous to register not as conditional middleware, but as a templating engine. That
// may be more idiomatically Express and expressive when using methods like `res.render`
/**
 * Middleware for augmenting HTML metadata for Archivist Blocks
 */
export const configureArchivistBlock = <T extends ApplicationMiddlewareOptions>(opts: T): MountPathAndMiddleware => [
  'get',
  ['*', getHandler(opts.baseDir)],
]
