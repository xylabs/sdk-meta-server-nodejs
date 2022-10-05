import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { Meta } from '@xyo-network/sdk-meta'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { extname, join } from 'path'

import { getAdjustedPath, getUriBehindProxy } from '../../lib'
import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'
import { setHtmlMetaData } from './setHtmlMetaData'

const defaultHtmlMeta: Meta = {
  description: "Own your piece of XYO's Decentralized Digital World!",
  og: {},
  title: 'XYO 2.0',
  twitter: {},
}

const tenSecondsInMs = 10000

const getHandler = (baseDir: string) => {
  // If file containing standard HTML meta exists use it otherwise use defaults
  const metaPath = join(baseDir, 'meta.json')
  const htmlMeta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, { encoding: 'utf-8' })) : defaultHtmlMeta

  return asyncHandler(async (req, res, next) => {
    const adjustedPath = getAdjustedPath(req)
    if (extname(adjustedPath) === '.html') {
      // TODO: Check if file exists
      const html = await readFile(join(baseDir, 'index.html'), { encoding: 'utf-8' })
      const uri = getUriBehindProxy(req)
      const updatedHtml = await setHtmlMetaData(uri, html, htmlMeta)
      res.set('Cache-Control', `public, max-age=${tenSecondsInMs}`).send(updatedHtml)
    } else {
      next()
    }
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
