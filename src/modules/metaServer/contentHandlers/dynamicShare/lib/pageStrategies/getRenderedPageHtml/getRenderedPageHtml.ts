import { usePage } from '../../../../../lib/index.js'

/**
 * Gets the rendered page html
 * @param url The url to navigate to
 * @param navigateToRootFirst Should navigate to the root of the url first, then navigate to the relative path
 * @returns The rendered page html
 */
export const getRenderedPageHtml = async (url: string): Promise<string | undefined> => {
  try {
    console.log(`[liveShare][getRenderedPageHtml][${url}]: rendering`)
    const html = await usePage(url, undefined, async (page) => {
      console.log(`[liveShare][getRenderedPageHtml][${url}]: navigated to ${url}`)
      return await page.content()
    })
    console.log(`[liveShare][getRenderedPageHtml][${url}]: rendered`)
    return html
  } catch (error) {
    console.log(error)
  }
  return undefined
}
