import { usePage } from './usePage'

export const pageHtmlWithPageImageAsMeta = async (url: string): Promise<string | undefined> => {
  const html: string | undefined = undefined
  await usePage(url, undefined, (page) => {
    // TODO: Generate image from page
  })
  return html
}
