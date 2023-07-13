import { metaBuilder } from '@xyo-network/sdk-meta'

import { join } from '../../../../lib'
import { ImageCache } from '../cache'
import { getRenderedPageAsImage } from '../getRenderedPageAsImage'

export const getIndexWithPageAsImage = async (uri: string, imageCache: ImageCache, indexHtml: string): Promise<string> => {
  console.log(`[foreventory][getIndexWithPageAsImage][${uri}]: rendering`)
  const previewUrl = join(uri, 'preview')
  const meta = await getRenderedPageAsImage(previewUrl, imageCache)
  console.log(`[foreventory][getIndexWithPageAsImage][${uri}]: rendered`)
  return meta ? metaBuilder(indexHtml, meta) : indexHtml
}
