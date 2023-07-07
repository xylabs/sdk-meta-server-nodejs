import { Meta, metaBuilder } from '@xyo-network/sdk-meta'

import { generateImageStringFromPage, usePage } from '../../../lib'

export const usePageMetaWithImage = async (url: string): Promise<string | undefined> => {
  try {
    const updatedHtml = await usePage(url, undefined, async (page) => {
      const image = await generateImageStringFromPage(page)
      const html = await page.content()
      const meta: Meta = {
        og: {
          image: {
            type: 'image/png;base64',
            url: image,
          },
        },
        twitter: {
          image: {
            url: image,
          },
        },
      }
      return metaBuilder(html, meta)
    })
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  return undefined
}
