import { join } from '../../../../../lib'
import { ImageCache } from '../../cache'
import { getRenderedPageAsImage } from '../../image'

export const getPagePreviewImage = (uri: string, imageCache: ImageCache): void => {
  console.log(`[foreventory][getPagePreviewImage][${uri}]: rendering`)
  const previewUrl = join(uri, 'preview')
  getRenderedPageAsImage(previewUrl, imageCache)
  console.log(`[foreventory][getPagePreviewImage][${uri}]: rendered`)
}
