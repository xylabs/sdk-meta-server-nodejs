import { assertEx } from '@xylabs/assert'
import { metaBuilder } from '@xyo-network/sdk-meta'
import { decode } from 'he'

import { ImageCache, usePage } from '../../../../../lib'
import { getPagePreviewImageMeta, getRenderedPageAsImage } from '../../image'

/**
 * The property name of the meta element
 * which contains the preview image URL
 */
const xyoOgImageProperty = 'xyo:og:image'

// Define the regex pattern to match the meta element
const xyoOgImageElementRegex = /<meta[^>]*property="xyo:og:image"[^>]*content="([^"]*)"[^>]*>/

export const useIndexAndDeferredPreviewImage = async (url: string, imageCache: ImageCache, indexHtml: string): Promise<string> => {
  try {
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: rendering in background`)
    // TODO: Optimize this with something like React SSR
    const content = await usePage(url, undefined, async (page) => {
      console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: navigated to ${url}`)
      await page.waitForSelector('head > meta[property="xyo:og:image"]', { timeout: 15000 })
      console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: found meta property ${xyoOgImageProperty}`)
      return await page.content()
    })
    const html = assertEx(content, `[liveShare][useIndexAndDeferredPreviewImage][${url}]: error retrieving html`)
    // Use the regex to extract the expected meta element
    const match = html.match(xyoOgImageElementRegex)
    // Extract the preview image URL from the meta element & decode it
    const previewUrl = decode(
      assertEx(match?.[1], `[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, missing meta element with ${xyoOgImageProperty} property`),
    )
    getRenderedPageAsImage(previewUrl, imageCache)
    const meta = getPagePreviewImageMeta(url)
    // TODO: Use page meta since we already took the hit to render
    const updatedHtml = metaBuilder(indexHtml, meta)
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: returning index.html & preview image meta`)
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}
