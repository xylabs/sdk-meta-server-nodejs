import { forget } from '@xylabs/forget'
import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import {
  FileRepository,
  join,
  RepositoryFile,
  summaryCardImageFromPage,
  summaryCardViewport,
  summaryCardWithLargeImageFromPage,
  summaryCardWithLargeImageViewport,
  useSpaPage,
} from '../../../../lib'
import { getImageUrl } from './getImageUrl'

/**
 * If true, use the large, rectangular image card. If false, use the small,
 * square image card.
 */
const useLargeImage = true

const { height, width } = useLargeImage ? summaryCardWithLargeImageViewport : summaryCardViewport
const twitterCardGenerator = useLargeImage ? summaryCardWithLargeImageFromPage : summaryCardImageFromPage

export const getRenderedPageAsImage = (url: string, imageCache: FileRepository): Meta | undefined => {
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation`)
  let imageUrl: string | undefined = undefined
  forget(
    useSpaPage(url, async (page) => {
      try {
        // TODO: Get from request, html-meta prop, or xyo.config
        const selector = '#preview-container'
        await page.waitForSelector(selector, { timeout: 30000 })
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: beginning`)
        const imageTask = twitterCardGenerator(page)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: caching`)
        const previewUrl = join(url, 'preview')
        imageUrl = getImageUrl(previewUrl, width, height)
        const file: RepositoryFile = { data: imageTask, type: 'image/png', uri: imageUrl }
        await imageCache.addFile(file)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: awaiting generation`)
        await imageTask
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: complete`)
      } catch (error) {
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: error`)
        console.log(error)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: removing cached`)
        if (imageUrl) {
          await imageCache.removeFile(imageUrl)
        }
      }
    }),
  )
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: generating image meta`)
  const og: OpenGraphMeta = { image: { '': url, height, secure_url: url, type: 'image/png', url: url, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': url } }
  const meta: Meta = { og, twitter }
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: returning image meta`)
  return meta
}
