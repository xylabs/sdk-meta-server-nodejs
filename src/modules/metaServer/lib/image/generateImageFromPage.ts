import { launch } from 'puppeteer'

export const generateImageFromPage = async (url: string): Promise<Buffer | undefined> => {
  const browser = await launch(/* { headless: false, defaultViewport: null } */)
  try {
    const [page] = await browser.pages()
    await page.goto(url)
    const image = await page.screenshot({ fullPage: true, path: 'screenshot.png', type: 'png' })
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
