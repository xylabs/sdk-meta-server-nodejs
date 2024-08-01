import { metaBuilder } from '@xyo-network/sdk-meta'

import { getImageMeta } from '../../image/index.ts'

export const useIndexAndDynamicPreviewImage = async (url: string, indexHtml: string): Promise<string> => {
  await Promise.resolve()
  try {
    console.log(`[dynamicShare][useIndexAndDeferredPreviewImage][${url}]: generating preview image meta`)
    const meta = getImageMeta(url)
    const updatedHtml = metaBuilder(indexHtml, meta)
    console.log(`[dynamicShare][useIndexAndDeferredPreviewImage][${url}]: returning index.html & preview image meta`)
    return updatedHtml
  } catch (error) {
    console.log(error)
  }
  console.log(`[dynamicShare][useIndexAndDeferredPreviewImage][${url}]: error, returning index.html`)
  return indexHtml
}
