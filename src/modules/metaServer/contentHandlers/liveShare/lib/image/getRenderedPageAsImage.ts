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

const type = 'image/png'

/**
 * Generates a page preview image and stores it in the image repository for the given url
 * @param url The page url
 * @param previewUrl The url for the page from which to generate the page preview image
 * @param imageRepository The image repository to store the generated page preview image in
 * @returns
 */
export const getRenderedPageAsImage = (url: string, previewUrl: string, imageRepository: FileRepository): Meta | undefined => {
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation`)
  let imageUrl: string | undefined = undefined
  forget(
    useSpaPage(previewUrl, async (page) => {
      try {
        // TODO: Get from request, html-meta prop, or xyo.config
        const selector = '#preview-container'
        await page.waitForSelector(selector, { timeout: 30000 })
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: beginning`)
        const data = twitterCardGenerator(page)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: caching`)
        imageUrl = getImageUrl(join(url, 'preview'), width, height)
        const file: RepositoryFile = { data, type, uri: imageUrl }
        await imageRepository.addFile(file)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: awaiting generation`)
        await data
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: complete`)
      } catch (error) {
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: error`)
        console.log(error)
        console.log(`[liveShare][getRenderedPageAsImage][${url}]: backgrounding image generation: removing cached`)
        if (imageUrl) {
          await imageRepository.removeFile(imageUrl)
        }
      }
    }),
  )
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: generating image meta`)
  const og: OpenGraphMeta = { image: { '': url, height, secure_url: url, type, url, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': url } }
  const meta: Meta = { og, twitter }
  console.log(`[liveShare][getRenderedPageAsImage][${url}]: returning image meta`)
  return meta
}
