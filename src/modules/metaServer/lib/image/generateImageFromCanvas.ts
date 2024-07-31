import { PageRenderingOptions, usePage } from '../page/index.js'

export interface CanvasImageOptions extends PageRenderingOptions {
  canvasSelector: string
}

export const generateImageFromCanvas = async (url: string, opts: CanvasImageOptions): Promise<string | undefined> => {
  let image: string | undefined = undefined
  await usePage(url, opts, async (page) => {
    const frame = await (await page?.$(opts.canvasSelector))?.contentFrame()
    image = await frame?.evaluate(() => {
      return document.querySelector<HTMLCanvasElement>('#myCanvas')?.toDataURL()
    })
  })
  return image
}
