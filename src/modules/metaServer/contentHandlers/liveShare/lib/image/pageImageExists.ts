import { FileRepository } from '../../../../lib/index.ts'
import { getImageUrlFromPageUrl } from '../url/index.ts'

/**
 * Checks if the page image exists in the cache
 * @param url The url of the page to check
 * @param imageRepository The image repository to check for the page image
 * @param width The width of the page image
 * @param height The height of the page image
 * @returns True if the page image exists in the cache, false otherwise
 */
export const pageImageExists = async (url: string, imageRepository: FileRepository, width: number, height: number): Promise<boolean> => {
  console.log(`[liveShare][pageImageExists][${url}]: Checking cache`)
  const imageUrl = getImageUrlFromPageUrl(url, width, height)
  try {
    const image = await imageRepository.findFile(imageUrl)
    if (image) {
      console.log(`[liveShare][pageImageExists][${url}]: Image exists`)
      return true
    } else {
      console.log(`[liveShare][pageImageExists][${url}]: Image does not exist`)
    }
  } catch {
    console.log(`[liveShare][pageImageExists][${url}]: Error checking cache`)
  }
  return false
}
