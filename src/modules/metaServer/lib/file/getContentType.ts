import mime from 'mime'

export const getContentType = (filePath: string): string | false => {
  return mime.getType(filePath) ?? false
}
