import { lookup } from 'mime'

export const isKnownFileExtension = (filePath: string): boolean => {
  // const extension = extname(filePath).toLowerCase()
  // return knownFileExtensions[extension] ?? false
  return lookup(filePath) ? true : false
}
