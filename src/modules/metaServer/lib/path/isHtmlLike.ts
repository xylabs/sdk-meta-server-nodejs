import Path from 'node:path'

import { Request } from 'express'

import { isKnownFileExtension } from '../file/index.js'

/**
 * Returns true request path could be referring
 * to an HTML file
 * @param req The web request
 * @returns True if the request path could be referring,
 * to an HTML document, false otherwise
 */
export const isHtmlLike = (req: Request): boolean => {
  const ext = Path.extname(req.path)
  if (ext.length === 0) return true
  if (ext.toLowerCase() === '.html') return true
  if (!isKnownFileExtension(req.path)) return true
  return false
}
