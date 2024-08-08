import { metaBuilder } from '@xyo-network/sdk-meta'

import { getImageMeta } from '../../image/index.ts'

export const useIndexAndDynamicPreviewImage = async (url: string, indexHtml: string): Promise<string> => {
  console.log(`[dynamicShare][useIndexAndDynamicPreviewImage][${url}]: generating preview image meta`)
  const meta = await getImageMeta(url)
  const updatedHtml = metaBuilder(indexHtml, meta)
  console.log(`[dynamicShare][useIndexAndDynamicPreviewImage][${url}]: returning index.html & preview image meta`)
  return updatedHtml
}
