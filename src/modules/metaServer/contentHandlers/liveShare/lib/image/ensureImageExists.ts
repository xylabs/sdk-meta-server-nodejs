import { forget } from '@xylabs/forget'

import {
  FileRepository,
  RepositoryFile,
  summaryCardImageFromPage,
  summaryCardViewport,
  summaryCardWithLargeImageFromPage,
  summaryCardWithLargeImageViewport,
  useSpaPage,
} from '../../../../lib'
import { getImageUrlFromPageUrl } from '../url'
import { tryGetPreviewUrlFromPage } from './getPreviewUrlFromPage'
import { pageImageExists } from './pageImageExists'

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
export const ensureImageExists = (url: string, imageRepository: FileRepository) => {
  console.log(`[liveShare][ensureImageExists][${url}]: backgrounding image task`)
  const task = async () => {
    console.log(`[liveShare][ensureImageExists][${url}]: checking for cached image`)
    if (await pageImageExists(url, imageRepository, width, height)) return
    console.log(`[liveShare][ensureImageExists][${url}]: getting preview url`)
    const previewUrl: string | undefined = await tryGetPreviewUrlFromPage(url)
    if (!previewUrl) return
    console.log(`[liveShare][ensureImageExists][${url}]: generating image`)
    await getImageFromPreviewUrl(url, previewUrl, imageRepository)
  }
  forget(task())
  console.log(`[liveShare][ensureImageExists][${url}]: backgrounded image task`)
  return
}

const getImageFromPreviewUrl = async (url: string, previewUrl: string, imageRepository: FileRepository) => {
  await useSpaPage(previewUrl, async (page) => {
    const imageUrl: string = getImageUrlFromPageUrl(url, width, height)
    try {
      // TODO: Get selector from request, html-meta prop, or xyo.config
      const selector = '#preview-container'
      await page.waitForSelector(selector, { timeout: 30000 })
      console.log(`[liveShare][getImageFromPreviewUrl][${url}]: image generation: rendering`)
      const data = twitterCardGenerator(page)
      console.log(`[liveShare][getImageFromPreviewUrl][${url}]: image generation: caching`)
      const file: RepositoryFile = { data, type, uri: imageUrl }
      await imageRepository.addFile(file)
      console.log(`[liveShare][getImageFromPreviewUrl][${url}]: image generation: awaiting generation`)
      await data
      console.log(`[liveShare][getImageFromPreviewUrl][${url}]: image generation: complete`)
    } catch (error) {
      console.log(`[liveShare][getImageFromPreviewUrl][${url}]: image generation: error`)
      console.log(error)
      console.log(`[liveShare][getImageFromPreviewUrl][${url}]: image generation: removing cached`)
      if (imageUrl) {
        await imageRepository.removeFile(imageUrl)
      }
    }
  })
}
