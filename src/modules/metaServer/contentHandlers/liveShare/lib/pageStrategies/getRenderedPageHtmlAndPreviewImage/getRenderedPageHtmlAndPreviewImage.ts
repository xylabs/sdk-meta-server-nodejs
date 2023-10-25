import { metaBuilder } from '@xyo-network/sdk-meta'

import { FileRepository } from '../../../../../lib'
import { getRenderedPageAsImage } from '../../image'
import { getPreviewUrl } from '../../url'
import { getRenderedPageHtml } from '../getRenderedPageHtml'

export const getRenderedPageHtmlAndPreviewImage = async (url: string, imageCache: FileRepository): Promise<string | undefined> => {
  try {
    console.log(`[liveShare][getRenderedPageHtmlAndPreviewImage][${url}]: rendering`)
    const previewUrl = getPreviewUrl(url)
    const [html, meta] = await Promise.all([getRenderedPageHtml(url), getRenderedPageAsImage(previewUrl, imageCache)])
    if (html && meta) {
      console.log(`[liveShare][getRenderedPageHtmlAndPreviewImage][${url}]: rendered html & preview image`)
      return metaBuilder(html, meta)
    }
  } catch (error) {
    console.log(error)
  }
  console.log(`[liveShare][getRenderedPageHtmlAndPreviewImage][${url}]: missing html or preview image`)
  return undefined
}
