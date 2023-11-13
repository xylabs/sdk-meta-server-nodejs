import { FileRepository } from '../../../../../lib'
import { getRenderedPageAsImage } from '../../image'

export const getPagePreviewImage = (url: string, imageRepository: FileRepository) => {
  console.log(`[liveShare][getPagePreviewImage][${url}]: rendering in background`)
  // Initiate the image generation but don't await it
  getRenderedPageAsImage(url, imageRepository)
}
