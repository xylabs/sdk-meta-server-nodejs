import { PageRenderingOptions } from './PageRenderingOptions'
import { usePage } from './usePage'

export interface CanvasImageOptions extends PageRenderingOptions {
  canvasSelector: string
}

export const generateImageFromCanvas = async (opts: CanvasImageOptions): Promise<string | undefined> => {
  let image: string | undefined = undefined
  await usePage(opts, async (page) => {
    const frame = await (await page?.$(opts.canvasSelector))?.contentFrame()
    image = await frame?.evaluate(() => {
      return document.querySelector<HTMLCanvasElement>('#myCanvas')?.toDataURL()
    })
  })
  return image
}
