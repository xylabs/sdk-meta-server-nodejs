import { getType } from 'mime'

export const getContentType = (filePath: string): string | false => {
  return getType(filePath) ?? false
}
