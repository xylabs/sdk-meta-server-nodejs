import { log } from 'node:console'

import { useSpaPage } from '../page/index.ts'

/**
 * Gets the rendered page html by navigating to the root of the url first, then to the relative path, just like a user would
 * when navigating a SPA
 * @param url The url to navigate to
 * @param logScopePrefix The prefix to use for logging
 * @returns The rendered page html
 */
export const getRenderedSpaPageHtml = async (url: string, logScopePrefix: string): Promise<string | undefined> => {
  try {
    log('rendering', [logScopePrefix, 'getRenderedSpaPageHtml', url])
    const html = await useSpaPage(url, async (page) => {
      log('navigated to url', [logScopePrefix, 'getRenderedSpaPageHtml', url])
      return await page.content()
    })
    log('rendered', [logScopePrefix, 'getRenderedSpaPageHtml', url])
    return html
  } catch (error) {
    console.log(error)
  }
  return undefined
}
