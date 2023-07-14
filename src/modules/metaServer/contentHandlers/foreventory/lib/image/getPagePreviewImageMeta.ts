import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import { join } from '../../../../lib'
import { getImageUrl } from './getImageUrl'

export const getPagePreviewImageMeta = (url: string, width = 1600, height = 900): Meta => {
  console.log(`[foreventory][getPagePreviewImageMeta][${url}]: generating`)
  const previewUrl = join(url, 'preview')
  const imageUrl = getImageUrl(previewUrl, width, height)
  const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta: Meta = { og, twitter }
  console.log(`[foreventory][getPagePreviewImageMeta][${url}]: generated`)
  return meta
}
