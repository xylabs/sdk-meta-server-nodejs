import type { FileRepository, RepositoryFile } from '../../../../lib/index.ts'
import { useSpaPage } from '../../../../lib/index.ts'
import { getImageUrlFromPageUrl } from '../url/index.ts'
import { imageGenerator, type } from './imageGenerator.ts'

export const generateImage = (url: string, previewUrl: string, imageRepository: FileRepository, width: number, height: number) => {
  return useSpaPage(previewUrl, async (page) => {
    const imageUrl: string = getImageUrlFromPageUrl(url, width, height)
    try {
      // TODO: Get selector from request, html-meta prop, or xyo.config
      const selector = '#preview-container'
      await page.waitForSelector(selector, { timeout: 30_000 })
      console.log(`[liveShare][generateImage][${url}]: image generation: rendering`)
      const data = imageGenerator(page)
      console.log(`[liveShare][generateImage][${url}]: image generation: caching`)
      const file: RepositoryFile = {
        data, type, uri: imageUrl,
      }
      await imageRepository.addFile(file)
      console.log(`[liveShare][generateImage][${url}]: image generation: awaiting generation`)
      await data
      console.log(`[liveShare][generateImage][${url}]: image generation: complete`)
    } catch (error) {
      console.log(`[liveShare][generateImage][${url}]: image generation: error`)
      console.log(error)
      console.log(`[liveShare][generateImage][${url}]: image generation: removing cached`)
      if (imageUrl) {
        await imageRepository.removeFile(imageUrl)
      }
    }
  })
}
