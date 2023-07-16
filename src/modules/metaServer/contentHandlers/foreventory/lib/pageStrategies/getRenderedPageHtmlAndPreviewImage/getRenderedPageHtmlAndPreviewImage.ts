import { metaBuilder } from '@xyo-network/sdk-meta'

import { ImageCache } from '../../cache'
import { getRenderedPageAsImage } from '../../image'
import { getPreviewUrl } from '../../url'
import { getRenderedPageHtml } from '../getRenderedPageHtml'

export const getRenderedPageHtmlAndPreviewImage = async (url: string, imageCache: ImageCache): Promise<string | undefined> => {
  try {
    console.log(`[foreventory][getRenderedPageHtmlAndPreviewImage][${url}]: rendering`)
    const previewUrl = getPreviewUrl(url)
    const [html, meta] = await Promise.all([getRenderedPageHtml(url), getRenderedPageAsImage(previewUrl, imageCache)])
    if (html && meta) {
      console.log(`[foreventory][getRenderedPageHtmlAndPreviewImage][${url}]: rendered html & preview image`)
      return metaBuilder(html, meta)
    }
  } catch (error) {
    console.log(error)
  }
  console.log(`[foreventory][getRenderedPageHtmlAndPreviewImage][${url}]: missing html or preview image`)
  return undefined
}