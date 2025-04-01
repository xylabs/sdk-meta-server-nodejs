/**
 * A type representing the origin and relative path of a URL.
 */
export type OriginAndRelativePath = {
  /**
   * The origin of the URL, including the protocol and host.
   */
  origin: string
  /**
   * The relative path of the URL, including the pathname and search parameters.
   */
  relativePath: string
}

/**
 * Parses a string URL into a base URL and a relative path.
 * @param url - The URL to parse
 * @returns An object containing the origin and relative path of the URL
 */
export const parseOriginAndRelativePath = (url: string): OriginAndRelativePath => {
  const parsed = new URL(url)
  const {
    origin, pathname, search,
  } = parsed
  const relativePath = search ? `${pathname}${search}` : pathname
  return { origin, relativePath }
}
