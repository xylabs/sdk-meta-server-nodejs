import { FileRepository } from '../../../../lib'
import { getImageUrlFromPageUrl } from '../url'

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
  } catch (error) {
    console.log(`[liveShare][pageImageExists][${url}]: Error checking cache`)
  }
  return false
}
