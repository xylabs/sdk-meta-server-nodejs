import { assertEx } from '@xylabs/assert'
import { metaBuilder } from '@xyo-network/sdk-meta'
import { decode } from 'he'

import { ImageCache } from '../../cache'
import { getPagePreviewImageMeta, getRenderedPageAsImage } from '../../image'
import { getRenderedPageHtml } from '../getRenderedPageHtml'

/**
 * The property name of the meta element
 * which contains the preview image URL
 */
const xyoOgImageProperty = 'xyo:og:image'

// Define the regex pattern to match the meta element
const regexPattern = /<meta[^>]*property="xyo:og:image"[^>]*content="([^"]*)"[^>]*>/

export const useIndexAndDeferredPreviewImage = async (url: string, imageCache: ImageCache, indexHtml: string): Promise<string> => {
  try {
    console.log(`[liveShare][useIndexAndDeferredPreviewImage][${url}]: rendering in background`)
    // TODO: Optimize this with something like React SSR
    // Parse head for xyo:og:image data URL
    // const metaImageElement = assertEx(
    //   await usePage(url, undefined, async (page) => {
    //     console.log(`[liveShare][getRenderedPageHtml][${url}]: navigated to ${url}`)
    //     return await page.evaluate(() => {
    //       // Find the first meta element with the specified property
    //       const meta = document.head.querySelector(`meta[property="${xyoOgImageProperty}"]`)
    //       // Extract the meta element's attributes
    //       if (meta) {
    //         const content = meta.getAttribute('content')
    //         if (content) {
    //           return { content, property: xyoOgImageProperty }
    //         }
    //       }
    //       return undefined
    //     })
    //   }),
    //   `[liveShare][useIndexAndDeferredPreviewImage][${url}]: error, missing meta element with ${xyoOgImageProperty} property`,
    // )
    // const previewUrl = metaImageElement.content
    const html = assertEx(await getRenderedPageHtml(url), `[liveShare][useIndexAndDeferredPreviewImage][${url}]: error retrieving html`)
    // Use the regex to extract the expected meta element
    const match = html.match(regexPattern)
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
