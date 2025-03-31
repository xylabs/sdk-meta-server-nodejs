/**
 * Joins the given URL parts together similar to `path.join`.
 * @param parts The URL parts to join
 * @returns The joined URL
 */
export const join = (...parts: string[]): string => {
  // eslint-disable-next-line unicorn/no-array-reduce, sonarjs/reduce-initial-value
  return parts.reduce((acc, part) => {
    const url = new URL(acc)
    // Ensure trailing slash
    if (!url.pathname.endsWith('/')) url.pathname += '/'
    // Remove leading slash
    if (part.startsWith('/')) part = part.slice(1)
    // Append part
    url.pathname += part
    return url.toString()
  })
}
