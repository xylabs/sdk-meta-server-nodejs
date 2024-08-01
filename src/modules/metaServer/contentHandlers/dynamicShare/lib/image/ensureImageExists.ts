import { forget } from '@xylabs/forget'

import { preCacheFacebookShare } from '../../../../lib/index.js'

/**
 * Ensures a page preview image exists for the supplied uri. If the image does not exist,
 * it will be generated and cached.
 * @param url The page url
 * @param previewUrl The url for the page from which to generate the page preview image
 * @param imageRepository The image repository to store the generated page preview image in
 * @returns
 */
export const ensureImageExists = (url: string) => {
  console.log(`[dynamicShare][ensureImageExists][${url}]: backgrounding image task`)
  const task = async () => {
    console.log(`[dynamicShare][ensureImageExists][${url}]: checking for cached image`)
    console.log(`[dynamicShare][ensureImageExists][${url}]: getting preview url`)
    console.log(`[dynamicShare][ensureImageExists][${url}]: generating image`)
    console.log(`[dynamicShare][ensureImageExists][${url}]: pre-caching social media share image`)
    await preCacheFacebookShare(url)
  }
  forget(task())
  console.log(`[dynamicShare][ensureImageExists][${url}]: backgrounded image task`)
  return
}
