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
import { getPreviewUrlFromPage } from './getPreviewUrlFromPage'

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
    const imageUrl: string = getImageUrlFromPageUrl(url, width, height)
    let previewUrl: string | undefined = undefined
    try {
      console.log(`[liveShare][ensureImageExists][${url}]: checking for cached image`)
      // Check if we've already got a preview for this URL
      if (imageUrl && (await imageRepository.findFile(imageUrl))) {
        console.log(`[liveShare][ensureImageExists][${url}]: image already exists, skipping rendering`)
        return
      } else {
        console.log(`[liveShare][ensureImageExists][${url}]: getting preview URL from page`)
        // Extract the preview image URL from the meta element & decode it
        previewUrl = await getPreviewUrlFromPage(url)
      }
    } catch (error) {
      console.log(`[liveShare][ensureImageExists][${url}]: error getting preview URL from page`)
      console.log(`[liveShare][ensureImageExists][${url}]: ${error}`)
      return
    }
    if (!previewUrl) {
      console.log(`[liveShare][ensureImageExists][${url}]: unable to obtain preview URL from page`)
      return
    }
    console.log(`[liveShare][ensureImageExists][${url}]: rendering`)
    useSpaPage(previewUrl, async (page) => {
      try {
        // TODO: Get selector from request, html-meta prop, or xyo.config
        const selector = '#preview-container'
        await page.waitForSelector(selector, { timeout: 30000 })
        console.log(`[liveShare][ensureImageExists][${url}]: image generation: beginning`)
        const data = twitterCardGenerator(page)
        console.log(`[liveShare][ensureImageExists][${url}]: image generation: caching`)
        const file: RepositoryFile = { data, type, uri: imageUrl }
        await imageRepository.addFile(file)
        console.log(`[liveShare][ensureImageExists][${url}]: image generation: awaiting generation`)
        await data
        console.log(`[liveShare][ensureImageExists][${url}]: image generation: complete`)
      } catch (error) {
        console.log(`[liveShare][ensureImageExists][${url}]: image generation: error`)
        console.log(error)
        console.log(`[liveShare][ensureImageExists][${url}]: image generation: removing cached`)
        if (imageUrl) {
          await imageRepository.removeFile(imageUrl)
        }
      }
    })
  }
  forget(task())
  console.log(`[liveShare][ensureImageExists][${url}]: backgrounded image task`)
  return
}

const checkForCachedPageImage = async (url: string, imageRepository: FileRepository): Promise<boolean> => {
  console.log(`[liveShare][checkForCachedPageImage][${url}]: Checking cache`)
  const imageUrl: string = getImageUrlFromPageUrl(url, width, height)
  const image = await imageRepository.findFile(imageUrl)
  if (image) {
    console.log(`[liveShare][checkForCachedPageImage][${url}]: Image exists`)
    return true
  } else {
    console.log(`[liveShare][checkForCachedPageImage][${url}]: Image does not exist`)
    return false
  }
}
