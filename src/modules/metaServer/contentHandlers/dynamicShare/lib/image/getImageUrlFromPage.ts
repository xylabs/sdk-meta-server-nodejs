import { assertEx } from '@xylabs/assert'
import he from 'he'
const { decode } = he

import { useSpaPage } from '../../../../lib/index.ts'

/**
 * The property name of the meta element
 * which contains the preview image URL
 */
const xyoOgImageProperty = 'xyo:og:image'

// Define the regex pattern to match the meta element
const xyoOgImageElementRegex = /<meta[^>]*property="xyo:og:image"[^>]*content="([^"]*)"[^>]*>/

/**
 * Returns the URL of the image from within the Dynamic Share page's meta tags
 * @param url The URL of the Dynamic Share page
 * @returns The URL of the preview image from within the Dynamic Share page's meta tags
 */
export const getImageUrlFromPage = async (url: string): Promise<string> => {
  // TODO: Optimize this with something like React SSR
  const content = await useSpaPage(url, async (page) => {
    console.log(`[dynamicShare][getPreviewUrlFromPage][${url}]: navigated to ${url}`)
    // await page.waitForSelector('head > meta[property="xyo:og:image"]', { timeout: 15_000 })
    await page.waitForSelector('head > meta[property="og:image"]', { timeout: 15_000 })
    console.log(`[dynamicShare][getPreviewUrlFromPage][${url}]: found meta property ${xyoOgImageProperty}`)
    return await page.content()
  })
  const html = assertEx(content, `[dynamicShare][getPreviewUrlFromPage][${url}]: error retrieving html`)
  // Use the regex to extract the expected meta element
  const match = html.match(xyoOgImageElementRegex)
  // Extract the preview image URL from the meta element & decode it
  const imageUrl = decode(
    assertEx(match?.[1], `[dynamicShare][getPreviewUrlFromPage][${url}]: error, missing meta element with ${xyoOgImageProperty} property`),
  )
  return imageUrl
}
