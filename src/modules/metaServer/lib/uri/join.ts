/**
 * Joins the given URL parts together similar to `path.join`.
 * @param parts The URL parts to join
 * @returns The joined URL
 */
export const join = (...parts: string[]): string => {
  if (parts.length === 0) throw new Error('Must pass at least one URL part')
  const base = new URL(parts[0])
  for (let i = 1; i < parts.length; i++) {
    let part = parts[i]
    if (part.startsWith('/')) part = part.slice(1)
    if (!base.pathname.endsWith('/')) base.pathname += '/'
    base.pathname += part
  }
  return base.toString()
}
