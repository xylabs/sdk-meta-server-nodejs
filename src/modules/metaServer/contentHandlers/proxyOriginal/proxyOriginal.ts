import serveStatic, { ServeStaticOptions } from 'serve-static'

import { ApplicationMiddlewareOptions, MountPathAndMiddleware } from '../../types'

const oneDayInMs = 1000 * 60 * 60 * 24
const options: ServeStaticOptions = {
  cacheControl: true,
  // etag: true,
  fallthrough: false,
  maxAge: oneDayInMs,
}

const getHandler = (baseDir: string) => {
  return serveStatic(baseDir, options)

  // return asyncHandler(async (req, res) => {
  //   const adjustedPath = getAdjustedPath(req)
  //   res.send(await readFile(join(baseDir, adjustedPath)))
  // })
}

/**
 * Middleware to proxy the original response without any modification
 */
export const configureProxyOriginal = <T extends ApplicationMiddlewareOptions>(opts: T): MountPathAndMiddleware => ['get', ['*', getHandler(opts.baseDir)]]
