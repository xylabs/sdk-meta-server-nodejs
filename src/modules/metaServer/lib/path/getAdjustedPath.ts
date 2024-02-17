import { join } from 'node:path'

import { Request } from 'express'

import { isKnownFileExtension } from '../file'

export const getAdjustedPath = (req: Request): string => {
  if (isKnownFileExtension(req.path)) return req.path
  return join(req.path, 'index.html')
}
