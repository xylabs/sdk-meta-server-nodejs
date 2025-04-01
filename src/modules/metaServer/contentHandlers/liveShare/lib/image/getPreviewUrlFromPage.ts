import { assertEx } from '@xylabs/assert'
import he from 'he'
const { decode } = he

import {
  ImageMetaTag, useSpaPage, waitForImageMetaTag,
} from '../../../../lib/index.ts'

// Define the regex pattern to match the meta element
const xyoOgImageElementRegex = /<meta[^>]*property="xyo:og:image"[^>]*content="([^"]*)"[^>]*>/

/**
 * Returns the URL of the preview image from within the Live Share page's meta tags
 * @param url The URL of the Live Share page
 * @returns The URL of the preview image from within the Live Share page's meta tags
 */
export const getPreviewUrlFromPage = async (url: string): Promise<string> => {
  // TODO: Optimize this with something like React SSR
  const content = await useSpaPage(url, async (page) => {
    console.log(`[liveShare][getPreviewUrlFromPage][${url}]: navigated to ${url}`)
    await waitForImageMetaTag(page, { timeout: 15_000 })
    console.log(`[liveShare][getPreviewUrlFromPage][${url}]: found meta property ${ImageMetaTag}`)
    return await page.content()
  })
  const html = assertEx(content, () => `[liveShare][getPreviewUrlFromPage][${url}]: error retrieving html`)
  // Use the regex to extract the expected meta element
  const match = xyoOgImageElementRegex.exec(html)
  // Extract the preview image URL from the meta element & decode it
  const previewUrl = decode(
    assertEx(match?.[1], () => `[liveShare][getPreviewUrlFromPage][${url}]: error, missing meta element with ${ImageMetaTag} property`),
  )
  return previewUrl
}

/**
 * Returns the URL of the preview image from within the Live Share page's meta tags
 * or undefined if the preview image URL could not be obtained
 * @param url The URL of the Live Share page
 * @returns The URL of the preview image from within the Live Share page's meta tags
 * or undefined if the preview image URL could not be obtained
 */
export const tryGetPreviewUrlFromPage = async (url: string): Promise<string | undefined> => {
  try {
    return await getPreviewUrlFromPage(url)
  } catch {
    return undefined
  }
}
