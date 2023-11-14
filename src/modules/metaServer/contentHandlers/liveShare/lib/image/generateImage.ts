import { FileRepository, RepositoryFile, useSpaPage } from '../../../../lib'
import { getImageUrlFromPageUrl } from '../url'
import { imageGenerator, type } from './imageGenerator'

export const generateImage = (url: string, previewUrl: string, imageRepository: FileRepository, width: number, height: number) => {
  return useSpaPage(previewUrl, async (page) => {
    const imageUrl: string = getImageUrlFromPageUrl(url, width, height)
    try {
      // TODO: Get selector from request, html-meta prop, or xyo.config
      const selector = '#preview-container'
      await page.waitForSelector(selector, { timeout: 30000 })
      console.log(`[liveShare][getImageFromPreviewUrl][${url}]: image generation: rendering`)
      const data = imageGenerator(page)
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
