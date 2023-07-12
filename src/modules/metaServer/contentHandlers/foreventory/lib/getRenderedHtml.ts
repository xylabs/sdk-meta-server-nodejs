import { usePage } from '../../../lib'

export const getRenderedHtml = async (url: string): Promise<string | undefined> => {
  try {
    console.log(`[foreventory][getRenderedHtml][${url}]: rendering`)
    const html = await usePage(url, undefined, async (page) => await page.content())
    console.log(`[foreventory][getRenderedHtml][${url}]: returning`)
    return html
  } catch (error) {
    console.log(error)
  }
  return undefined
}
