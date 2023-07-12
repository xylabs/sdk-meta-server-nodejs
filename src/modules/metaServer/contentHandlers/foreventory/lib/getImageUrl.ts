import { join } from '../../../lib'

export const getImageUrl = (url: string, width: string | number, height: string | number): string => {
  return join(url, `${width}`, `${height}`, 'img.png')
}
