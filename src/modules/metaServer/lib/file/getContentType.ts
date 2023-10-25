import mime from 'mime'

export const getContentType = (filePath: string): string | null => {
  return mime.getType(filePath)
}
