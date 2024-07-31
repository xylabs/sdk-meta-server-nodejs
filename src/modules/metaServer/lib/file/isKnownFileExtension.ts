import { getType } from 'mime'

export const isKnownFileExtension = (filePath: string): boolean => {
  // const extension = extname(filePath).toLowerCase()
  // return knownFileExtensions[extension] ?? false
  return getType(filePath) ? true : false
}
