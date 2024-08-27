import { assertEx } from '@xylabs/assert'
import he from 'he'
const { decode } = he

import type { Logger } from '@xylabs/logger'
import { IdLogger } from '@xylabs/logger'

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
export const getImageUrlFromPage = (
  url: string,
  renderedHtml: string,
  logger: Logger = new IdLogger(console, () => `dynamicShare|getPreviewUrlFromPage|${url}`),
): string => {
  // Use the regex to extract the expected meta element
  const match = renderedHtml.match(xyoOgImageElementRegex)
  // Extract the preview image URL from the meta element & decode it
  const imageUrl = decode(
    assertEx(match?.[1], () => {
      logger.error(`error, missing meta element with ${xyoOgImageProperty} property`)
      return 'Error'
    }),
  )

  return imageUrl
}
