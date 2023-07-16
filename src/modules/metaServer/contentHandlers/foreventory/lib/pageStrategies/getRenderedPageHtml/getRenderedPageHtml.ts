import { PageRenderingOptions, usePage } from '../../../../../lib'

const opts: PageRenderingOptions = { waitUntil: ['domcontentloaded', 'networkidle0'] }

/**
 * Gets the rendered page html
 * @param url The url to navigate to
 * @param navigateToRootFirst Should navigate to the root of the url first, then navigate to the relative path
 * @returns The rendered page html
 */
export const getRenderedPageHtml = async (url: string, navigateToRootFirst = false): Promise<string | undefined> => {
  try {
    console.log(`[foreventory][getRenderedPageHtml][${url}]: rendering`)
    const parsed = new URL(url)
    const urlToNavigateTo = navigateToRootFirst ? parsed.origin : url
    const relativeUrl = parsed.pathname
    const html = await usePage(urlToNavigateTo, opts, async (page) => {
      console.log(`[foreventory][getRenderedPageHtml][${url}]: navigated to ${urlToNavigateTo}`)
      if (navigateToRootFirst) {
        await page.evaluate((path) => window.history.pushState(null, '', path), relativeUrl)
        console.log(`[foreventory][getRenderedPageHtml][${url}]: navigated browser history to ${relativeUrl}`)
      }
      await page.waitForNavigation(opts)
      const content = await page.content()
      return content
    })
    console.log(`[foreventory][getRenderedPageHtml][${url}]: rendered`)
    return html
  } catch (error) {
    console.log(error)
  }
  return undefined
}
