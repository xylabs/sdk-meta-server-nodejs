import { XyoBoundWitnessSchema } from '@xyo-network/boundwitness-model'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { Meta, metaBuilder } from '@xyo-network/sdk-meta'
import cloneDeep from 'lodash/cloneDeep'

import { PayloadInfo } from '../../types'
import { getArchivistForDomain } from './getArchivistForDomain'

export const setHtmlMetaData = async (info: PayloadInfo, html: string, config: Meta): Promise<string> => {
  const { apiDomain, hash, path } = info
  const meta = cloneDeep(config)
  if (hash && apiDomain) {
    try {
      const archivist = await getArchivistForDomain(apiDomain)
      const results = await archivist.get([hash])
      const payload = PayloadWrapper.tryParse(results?.[0])
      if (payload) {
        const schema = payload.schema
        const type = schema === XyoBoundWitnessSchema ? 'Bound Witness' : 'Payload'
        meta.title = `XYO 2.0: ${type} | ${hash}`
        meta.description = `A XYO 2.0 ${schema} payload with the hash ${hash}.`
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
