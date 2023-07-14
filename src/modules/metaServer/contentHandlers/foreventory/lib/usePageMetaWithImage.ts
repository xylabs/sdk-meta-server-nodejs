import { metaBuilder } from '@xyo-network/sdk-meta'

import { join } from '../../../lib'
import { ImageCache } from './cache'
import { getRenderedPageAsImage } from './getRenderedPageAsImage'
import { getRenderedHtml } from './pageStrategies/getRenderedHtml/getRenderedHtml'

export const usePageMetaWithImage = async (url: string, imageCache: ImageCache): Promise<string | undefined> => {
  try {
    const previewUrl = join(url, 'preview')
    const [html, meta] = await Promise.all([getRenderedHtml(url), getRenderedPageAsImage(previewUrl, imageCache)])
    if (html && meta) return metaBuilder(html, meta)
  } catch (error) {
    console.log(error)
  }
  return undefined
}
