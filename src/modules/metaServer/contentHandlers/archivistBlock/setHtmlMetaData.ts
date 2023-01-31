import { XyoArchivistApi } from '@xyo-network/api'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { Meta, metaBuilder } from '@xyo-network/sdk-meta'
import cloneDeep from 'lodash/cloneDeep'

import { ExplorerArchivistBlockInfo } from '../../types'

export const setHtmlMetaData = async (info: ExplorerArchivistBlockInfo, html: string, config: Meta): Promise<string> => {
  const { apiDomain, archive, hash, path, type } = info
  const meta = cloneDeep(config)
  if (archive && hash && type && apiDomain) {
    const api = new XyoArchivistApi({ apiDomain })
    try {
      const results = type === 'block' ? await api.archive(archive).block.hash(hash).get() : await api.archive(archive).payload.hash(hash).get()
      if (results && results.length > 0) {
        const wrapper = new PayloadWrapper(results[0])
        const hash = wrapper.hash
        const name = type === 'block' ? 'Bound Witness' : 'Payload'
        meta.title = `XYO 2.0: ${name} | ${hash}`
        meta.description = `A XYO 2.0 ${wrapper.body.schema} payload with the hash ${hash}.`
      }
    } catch (error) {
      console.log(error)
    }
  }

  meta.og = { ...meta.og, title: meta.title, url: path } as typeof meta.og
  meta.twitter = { ...meta.twitter, title: meta.title }
  const updated = metaBuilder(html, meta)
  return updated
}
