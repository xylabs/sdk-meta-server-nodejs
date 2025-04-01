export const parseOriginAndRelativePath = (url: string) => {
  const parsed = new URL(url)
  const {
    origin, pathname, search,
  } = parsed
  const relativePath = search ? `${pathname}${search}` : pathname
  return { origin, relativePath }
}
