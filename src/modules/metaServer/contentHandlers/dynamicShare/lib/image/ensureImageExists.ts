import { forget } from '@xylabs/forget'

import { FileRepository, preCacheFacebookShare } from '../../../../lib/index.js'
import { generateImage } from './generateImage.js'
import { tryGetPreviewUrlFromPage } from './getPreviewUrlFromPage.js'
import { height, width } from './imageGenerator.js'
import { pageImageExists } from './pageImageExists.js'

/**
 * Ensures a page preview image exists for the supplied uri. If the image does not exist,
 * it will be generated and cached.
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
    await generateImage(url, previewUrl, imageRepository, width, height)
    console.log(`[liveShare][ensureImageExists][${url}]: pre-caching social media share image`)
    await preCacheFacebookShare(url)
  }
  forget(task())
  console.log(`[liveShare][ensureImageExists][${url}]: backgrounded image task`)
  return
}
