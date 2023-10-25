import mime from 'mime'
import { lookup } from 'mime-types'

export const getContentType = (filePath: string): string | false => {
  return mime.getType(filePath) ?? false
}

export const getContentTypeViaLookup = (filePath: string): string | false => {
  return lookup(filePath)
}
