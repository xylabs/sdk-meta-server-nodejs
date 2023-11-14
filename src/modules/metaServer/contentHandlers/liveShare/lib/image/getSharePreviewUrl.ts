import { assertEx } from '@xylabs/assert'
import { decode } from 'he'

import { useSpaPage } from '../../../../lib'

/**
 * The property name of the meta element
 * which contains the preview image URL
 */
const xyoOgImageProperty = 'xyo:og:image'

// Define the regex pattern to match the meta element
const xyoOgImageElementRegex = /<meta[^>]*property="xyo:og:image"[^>]*content="([^"]*)"[^>]*>/

/**
 * Returns the URL of the preview image from within the Live Share page's meta tags
 * @param url The URL of the Live Share page
 * @returns The URL of the preview image from within the Live Share page's meta tags
 */
export const getSharePreviewUrl = async (url: string): Promise<string> => {
  // TODO: Optimize this with something like React SSR
  const content = await useSpaPage(url, async (page) => {
    console.log(`[liveShare][getSharePreviewUrl][${url}]: navigated to ${url}`)
    await page.waitForSelector('head > meta[property="xyo:og:image"]', { timeout: 15000 })
    console.log(`[liveShare][getSharePreviewUrl][${url}]: found meta property ${xyoOgImageProperty}`)
    return await page.content()
  })
  const html = assertEx(content, `[liveShare][getSharePreviewUrl][${url}]: error retrieving html`)
  // Use the regex to extract the expected meta element
  const match = html.match(xyoOgImageElementRegex)
  // Extract the preview image URL from the meta element & decode it
  const previewUrl = decode(
    assertEx(match?.[1], `[liveShare][getSharePreviewUrl][${url}]: error, missing meta element with ${xyoOgImageProperty} property`),
  )
  return previewUrl
}
