import { extname } from 'path'

import { knownFileExtensions } from './knownFileExtensions'

export const isKnownFileExtension = (filePath: string): boolean => {
  const extension = extname(filePath)
  return knownFileExtensions[extension] ?? false
}
