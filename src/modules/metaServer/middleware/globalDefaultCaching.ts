import type {
  NextFunction, Request, Response,
} from 'express'

import { globalCacheConfigLoader } from '../../../model/index.ts'
import { headersFromCacheConfig, loadXyConfig } from '../lib/index.ts'

export const getGlobalDefaultCaching = (baseDir: string) => {
  const xyConfig = loadXyConfig(baseDir, 'proxyExternal')
  return (req: Request, res: Response, next: NextFunction) => {
    res.set(headersFromCacheConfig(globalCacheConfigLoader(xyConfig)))
    next()
  }
}
