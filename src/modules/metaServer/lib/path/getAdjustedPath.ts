import { Request } from 'express'
import { join } from 'path'

import { isKnownFileExtension } from '../file'

export const getAdjustedPath = (req: Request): string => {
  if (isKnownFileExtension(req.path)) return req.path
  return join(req.path, 'index.html')
}
