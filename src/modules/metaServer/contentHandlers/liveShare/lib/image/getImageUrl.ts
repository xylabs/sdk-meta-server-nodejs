import { join, removeQueryParam } from '../../../../lib'

export const getImageUrl = (url: string, width: string | number, height: string | number): string => {
  return removeQueryParam(join(url, `${width}`, `${height}`, 'img.png'), 'render')
}
