export const getPageUrlFromImageUrl = (url: string): string => {
  return url.replace('/img.png', '')
}
