import { ImageCache, join } from '../../../../../lib'
import { getRenderedPageAsImage } from '../../image'

export const getPagePreviewImage = (uri: string, imageCache: ImageCache): void => {
  console.log(`[liveShare][getPagePreviewImage][${uri}]: rendering`)
  const previewUrl = join(uri, 'preview')
  getRenderedPageAsImage(previewUrl, imageCache)
  console.log(`[liveShare][getPagePreviewImage][${uri}]: rendered`)
}
