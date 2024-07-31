import { join, removeQueryParam } from '../../../../lib/index.js'

/**
 * Generates the url of the preview image for a Live Share page
 * @param url The url for the page
 * @param width The preview image width
 * @param height The preview image height
 * @returns The url of the preview image for a Live Share page
 */
export const getImageUrlFromPageUrl = (url: string, width: string | number, height: string | number): string => {
  // TODO: Only remove render if it's render=preview?
  return removeQueryParam(join(url, 'preview', `${width}`, `${height}`, 'img.png'), 'render')
}
