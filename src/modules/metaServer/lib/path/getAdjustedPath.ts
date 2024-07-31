import Path from 'node:path'

import { Request } from 'express'

import { isKnownFileExtension } from '../file/index.js'

export const getAdjustedPath = (req: Request): string => {
  if (isKnownFileExtension(req.path)) return req.path
  return Path.join(req.path, 'index.html')
}
