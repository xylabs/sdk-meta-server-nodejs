import { metaBuilder } from '@xyo-network/sdk-meta'

import { join } from '../../../lib'
import { ImageCache } from './cache'
import { getRenderedPageAsImage } from './getRenderedPageAsImage'
import { getRenderedPageHtml } from './pageStrategies'

export const usePageMetaWithImage = async (url: string, imageCache: ImageCache): Promise<string | undefined> => {
  try {
    const previewUrl = join(url, 'preview')
    const [html, meta] = await Promise.all([getRenderedPageHtml(url), getRenderedPageAsImage(previewUrl, imageCache)])
    if (html && meta) return metaBuilder(html, meta)
  } catch (error) {
    console.log(error)
  }
  return undefined
}
