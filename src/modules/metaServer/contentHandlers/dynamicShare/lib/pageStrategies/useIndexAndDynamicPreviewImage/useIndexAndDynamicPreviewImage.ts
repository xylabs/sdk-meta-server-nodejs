import { IdLogger, type Logger } from '@xylabs/logger'
import { metaBuilder } from '@xylabs/sdk-meta'

import { getRenderedPage } from '../../../../../lib/index.ts'
import { getImageMeta } from '../../image/index.ts'

export const useIndexAndDynamicPreviewImage = async (
  url: string,
  indexHtml: string,
  logger: Logger = new IdLogger(console, () => `dynamicShare|useIndexAndDynamicPreviewImage|${url}`),
): Promise<string> => {
  const renderedPage = await getRenderedPage(url, 'xyo:og:image')
  logger.log('generating preview image meta')
  const meta = await getImageMeta(url, renderedPage)
  meta.title = await renderedPage.title()
  logger.log(`setting title: ${meta.title}`)
  const updatedHtml = metaBuilder(indexHtml, meta)
  logger.log('returning index.html & preview image meta')
  return updatedHtml
}
