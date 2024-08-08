import { log } from '../logging/index.ts'
import { usePage } from '../page/index.ts'

/**
 * Gets the rendered page html
 * @param url The url to navigate to
 * @param logScopePrefix The prefix to use for logging
 * @returns The rendered page html
 */
export const getRenderedPageHtml = async (url: string, logScopePrefix: string): Promise<string | undefined> => {
  try {
    log('rendering', [logScopePrefix, 'getRenderedPageHtml', url])
    const html = await usePage(url, undefined, async (page) => {
      log('navigated to url', [logScopePrefix, 'getRenderedPageHtml', url])
      return await page.content()
    })
    log('rendered', [logScopePrefix, 'getRenderedPageHtml', url])
    return html
  } catch (error) {
    console.log(error)
  }
  return undefined
}
