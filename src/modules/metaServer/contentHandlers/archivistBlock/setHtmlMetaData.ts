import { assertEx } from '@xylabs/assert'
import { ArchivistWrapper } from '@xyo-network/archivist-wrapper'
import { XyoBoundWitnessSchema } from '@xyo-network/boundwitness-model'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/http-bridge'
import { PayloadWrapper } from '@xyo-network/payload-wrapper'
import { Meta, metaBuilder } from '@xyo-network/sdk-meta'
import cloneDeep from 'lodash/cloneDeep'

import { ExplorerArchivistBlockInfo } from '../../types'

const schema = HttpBridgeConfigSchema
const security = { allowAnonymous: true }

const name = 'Archivist'

export const setHtmlMetaData = async (info: ExplorerArchivistBlockInfo, html: string, config: Meta): Promise<string> => {
  const { apiDomain, hash, path } = info
  const meta = cloneDeep(config)
  if (hash && apiDomain) {
    try {
      const bridge = await HttpBridge.create({ config: { nodeUri: `${apiDomain}/node`, schema, security } })
      const resolved = await bridge.downResolver.resolve({ name: [name] })
      const mod = assertEx(resolved.pop(), `Failed to load module [${name}]`)
      const archivist = ArchivistWrapper.wrap(mod)
      const results = await archivist.get([hash])
      const wrapper = new PayloadWrapper(results[0])
      const type = wrapper.schema === XyoBoundWitnessSchema ? 'Bound Witness' : 'Payload'
      meta.title = `XYO 2.0: ${type} | ${hash}`
      meta.description = `A XYO 2.0 ${wrapper.body.schema} payload with the hash ${hash}.`
    } catch (error) {
      console.log(error)
    }
  }
  meta.og = { ...meta.og, title: meta.title, url: path } as typeof meta.og
  meta.twitter = { ...meta.twitter, title: meta.title }
  const updated = metaBuilder(html, meta)
  return updated
}
