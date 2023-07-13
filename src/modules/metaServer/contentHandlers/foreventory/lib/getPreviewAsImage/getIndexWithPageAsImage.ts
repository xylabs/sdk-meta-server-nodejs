import { join } from '../../../../lib'
import { ImageCache } from '../cache'
import { getRenderedPageAsImage } from '../getRenderedPageAsImage'

export const getPreviewAsImage = async (uri: string, imageCache: ImageCache): Promise<void> => {
  console.log(`[foreventory][getIndexWithPageAsImage][${uri}]: rendering`)
  const previewUrl = join(uri, 'preview')
  await getRenderedPageAsImage(previewUrl, imageCache)
  console.log(`[foreventory][getIndexWithPageAsImage][${uri}]: rendered`)
}
