/**
 * Create a regular expression that matches a SHA-256 hash and everything after it
 */
const regex = new RegExp('([a-fA-F0-9]{64}).*')

/**
 * Returns the url of the page that the image was generated from
 * @param url The url of the image
 * @returns The url of the page that the image was generated from
 */
export const getPageUrlFromImageUrl = (url: string): string => {
  const parsed = new URL(url)
  // Remove everything after the hash by replacing it with the hash itself
  const base = url.replace(regex, '$1')
  // Create the new URL
  const final = new URL(base)
  // Add the query params from the old URL
  final.search = parsed.search
  // Return the new URL as a string
  return final.toString()
}
