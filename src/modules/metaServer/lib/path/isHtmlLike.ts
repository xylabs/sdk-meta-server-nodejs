import { Request } from 'express'
import { extname } from 'path'

import { isKnownFileExtension } from '../file'

/**
 * Return request path if the request path has an
 * extension AND the extension is know web extension
 * Otherwise, add index.html if path has no extension
 * OR is not a known web extension
 * @param req The web request
 * @returns The appropriate path for the request path
 */
export const isHtmlLike = (req: Request): boolean => {
  const ext = extname(req.path)
  if (ext.length === 0) return true
  if (ext.toLowerCase() === '.html') return true
  if (!isKnownFileExtension(req.path)) return true
  // Has extension but now known web extension
  return false
}
