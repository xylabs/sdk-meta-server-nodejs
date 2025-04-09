import { existsSync, readFileSync } from 'node:fs'
import Path from 'node:path'

import { assertEx } from '@xylabs/assert'
import type {
  Empty, NoReqParams, NoReqQuery,
} from '@xylabs/express'
import { asyncHandler } from '@xylabs/express'
import { mergeDocumentHead } from '@xylabs/sdk-meta'
import type { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { LRUCache } from 'lru-cache'
import type { ServeStaticOptions } from 'serve-static'
import serveStatic from 'serve-static'

import {
  type MetaServerConfig,
  type PathFilter, proxyOriginalCacheConfigLoader,
  proxyOriginalIndexCacheConfigLoader,
  type XyConfig,
} from '../../../../model/index.ts'
import type { RouteMatcher } from '../../lib/index.ts'
import {
  createGlobMatcher,
  getAdjustedPath, headersFromCacheConfig, isHtmlLike, loadXyConfig,
} from '../../lib/index.ts'
import type { MetaCacheLocals } from '../../middleware/index.ts'
import type { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types/index.ts'
import { exists } from './lib/index.ts'

const existingPaths = new LRUCache<string, boolean>({ max: 1000 })

const getLanguage = (uri: string, languageMap: Record<string, PathFilter>) => {
  for (let [language, { include = [], exclude = [] }] of Object.entries(languageMap)) {
    const matchesIncluded: RouteMatcher = include ? createGlobMatcher(include) : () => false
    const matchesExcluded: RouteMatcher = exclude ? createGlobMatcher(exclude) : () => false
    if (matchesIncluded(uri) && !matchesExcluded(uri)) {
      return language
    }
  }
  return 'en'
}

const languageMapConfig = (config: XyConfig = {}): MetaServerConfig['languageMap'] => {
  // eslint-disable-next-line sonarjs/deprecation
  if (config?.languageMap) {
    console.warn('Using deprecated languageMap config. Please use metaServer.languageMap instead.')
  }

  // eslint-disable-next-line sonarjs/deprecation
  return config?.metaServer?.languageMap ?? { pathFilters: config?.languageMap } ?? { pathFilters: {} }
}

const getProxyOriginalHandler = (baseDir: string) => {
  const xyConfig = loadXyConfig(baseDir, 'proxyOriginal')
  const languageMap = languageMapConfig(xyConfig)
  // Ensure file containing base HTML exists
  const filePath = Path.join(baseDir, 'index.html')
  assertEx(existsSync(filePath), () => 'Missing index.html')
  const html = readFileSync(filePath, { encoding: 'utf8' })

  const cacheConfig = proxyOriginalCacheConfigLoader(xyConfig)

  const options: ServeStaticOptions = {
    cacheControl: true,
    // etag: true,
    fallthrough: false,
    index: 'index.html',
    maxAge: cacheConfig.maxAge,
  }

  const proxy = serveStatic(baseDir, options)
  const serveIndex: RequestHandler<NoReqParams, Empty, Empty, NoReqQuery, MetaCacheLocals> = (req, res, _next) => {
    let updated = html
    const path = getAdjustedPath(req)
    const updatedHead = res?.locals?.metaCache?.get?.(path)
    if (updatedHead) {
      updated = mergeDocumentHead(html, updatedHead)
    }
    const language = getLanguage(path, languageMap?.pathFilters ?? {})
    updated = updated.replace('<html lang="en">', `<html lang="${language}">`)
    res.type('html').set(headersFromCacheConfig(proxyOriginalIndexCacheConfigLoader(xyConfig))).send(updated)
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handler: RequestHandler<NoReqParams, Empty, Empty, NoReqQuery, MetaCacheLocals> = async (req, res, next) => {
    try {
      // Check if file exists on disk (cache check for performance)
      const file = getAdjustedPath(req)
      console.log(`[proxyOriginal][pageHandler][${file}]: called`)
      let pathExists = existingPaths.get(file)
      if (pathExists === undefined) {
        console.log(`[proxyOriginal][pageHandler][${file}]: path not cached`)
        const result = await exists(Path.join(baseDir, file))
        console.log(`[proxyOriginal][pageHandler][${file}]: cache path`)
        existingPaths.set(file, result)
        pathExists = result
      }
      if (pathExists) {
        if (file.endsWith('/index.html')) {
          console.log(`[proxyOriginal][pageHandler][${file}]: serve [actual] index`)
          serveIndex(req, res, next)
        } else {
          console.log(`[proxyOriginal][pageHandler][${file}]: serve proxy`)
          proxy(req, res, next)
        }
      } else {
        if (isHtmlLike(req)) {
          console.log(`[proxyOriginal][pageHandler][${file}]: serve index`)
          serveIndex(req, res, next)
        } else {
          res.sendStatus(StatusCodes.NOT_FOUND)
        }
      }
    } catch {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }
  return asyncHandler(handler) as unknown as RequestHandler
}

/**
 * Middleware to proxy the original response without any modification
 */
export const configureProxyOriginal = <T extends ApplicationMiddlewareOptions>(opts: T): MountPathAndMiddleware => [
  'get',
  ['*', getProxyOriginalHandler(opts.baseDir)],
]
