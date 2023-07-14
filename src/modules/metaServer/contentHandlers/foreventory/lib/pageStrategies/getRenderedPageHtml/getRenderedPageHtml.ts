import { usePage } from '../../../../../lib'

export const getRenderedPageHtml = async (url: string): Promise<string | undefined> => {
  try {
    console.log(`[foreventory][getRenderedPageHtml][${url}]: rendering`)
    const html = await usePage(url, undefined, async (page) => await page.content())
    console.log(`[foreventory][getRenderedPageHtml][${url}]: returning`)
    return html
  } catch (error) {
    console.log(error)
  }
  return undefined
}
