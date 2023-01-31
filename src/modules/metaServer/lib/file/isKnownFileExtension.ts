import mime from 'mime'

export const isKnownFileExtension = (filePath: string): boolean => {
  // const extension = extname(filePath).toLowerCase()
  // return knownFileExtensions[extension] ?? false
  return mime.getType(filePath) ? true : false
}
