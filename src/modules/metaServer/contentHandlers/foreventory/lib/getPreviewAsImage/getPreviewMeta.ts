import { Meta, OpenGraphMeta, TwitterMeta } from '@xyo-network/sdk-meta'

import { getImageUrl } from '../getImageUrl'

export const getPreviewMeta = (url: string, width = 1600, height = 900): Meta => {
  const imageUrl = getImageUrl(url, width, height)
  const og: OpenGraphMeta = { image: { '': imageUrl, height, secure_url: imageUrl, type: 'image/png', url: imageUrl, width } }
  const twitter: TwitterMeta = { card: 'summary_large_image', image: { '': imageUrl } }
  const meta: Meta = { og, twitter }
  return meta
}
