import { launch, ScreenshotOptions, Viewport } from 'puppeteer'

export type ImageEncoding = 'base64' | 'binary'

export interface ViewPortSize {
  height: number
  width: number
}

// NOTE: Should we use 16:9 ratio instead?
// https://developers.facebook.com/docs/sharing/best-practices/
const defaultViewportSize: ViewPortSize = {
  height: 1080,
  width: 1080,
}

const viewPortDefaults: Viewport = {
  ...defaultViewportSize,
  deviceScaleFactor: 1,
  hasTouch: false,
  isLandscape: false,
  isMobile: true, // So we can render as lean as possible
}

export const generateImageFromPage = async (
  url: string,
  encoding: ImageEncoding = 'base64',
  viewportSize: ViewPortSize = defaultViewportSize,
  outputPath?: string,
): Promise<Buffer | string | undefined> => {
  const defaultViewport = { ...viewPortDefaults, ...viewportSize }
  const browser = await launch({ defaultViewport, headless: 'new' })
  try {
    const [page] = await browser.pages()
    await page.goto(url)
    const opts: ScreenshotOptions = {
      encoding,
      fullPage: true,
      type: 'png',
    }
    if (outputPath) opts.path = outputPath
    const image = await page.screenshot(opts)
    return image
  } catch (err) {
    console.error(err)
  } finally {
    await browser.close()
  }
}

export const generateImageFromCanvas = async (
  url = 'https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_canvas_tut_path2',
  canvasSelector = '#iframeResult',
): Promise<string | undefined> => {
  const browser = await launch(/* { headless: false, defaultViewport: null } */)
  try {
    const [page] = await browser.pages()
    await page.goto(url)
    const frame = await (await page?.$(canvasSelector))?.contentFrame()
    const data = await frame?.evaluate(() => {
      return document.querySelector<HTMLCanvasElement>('#myCanvas')?.toDataURL()
    })
    return data // data:image/png;base64,iVBORw0K...
  } catch (err) {
    console.error(err)
  } finally {
    await browser.close()
  }
}
