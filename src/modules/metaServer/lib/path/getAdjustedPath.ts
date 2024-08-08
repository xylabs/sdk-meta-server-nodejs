import Path from 'node:path'

import { Request } from 'express'

import { isKnownFileExtension } from '../file/index.ts'

export const getAdjustedPath = (req: Request): string => {
  if (isKnownFileExtension(req.path)) return req.path
  return Path.join(req.path, 'index.html')
}
