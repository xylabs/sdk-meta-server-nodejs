import { assertEx } from '@xylabs/assert'
import { IdLogger, type Logger } from '@xylabs/logger'
import type { Meta } from '@xylabs/sdk-meta'
import { metaBuilder } from '@xylabs/sdk-meta'

import { useSpaPage, waitForImageMetaTag } from '../../../../../lib/index.ts'
import { getImageMeta } from '../../image/index.ts'

export const useIndexAndDynamicPreviewImage = async (
  url: string,
  indexHtml: string,
  logger: Logger = new IdLogger(console, () => `dynamicShare|useIndexAndDynamicPreviewImage|${url}`),
): Promise<string> => {
  const startTime = Date.now()
  logger.log('generating preview image meta')
  const meta = assertEx(await useSpaPage(url, async (renderedPage) => {
    await waitForImageMetaTag(renderedPage, { timeout: 10_000 })
    const meta = { ...await getImageMeta(url, renderedPage), xy: { timings: { render: `${Date.now() - startTime}ms` } } }
    meta.title = await renderedPage.title()
    logger.log('setting title', meta.title)
    logger.log('setting og:image', meta.og?.image)
    return meta as Meta
  }), () => 'error retrieving meta from page')
  const updatedHtml = metaBuilder(indexHtml, meta, 'dynamicShare')
  logger.log('returning index.html & preview image meta')
  return updatedHtml
}
