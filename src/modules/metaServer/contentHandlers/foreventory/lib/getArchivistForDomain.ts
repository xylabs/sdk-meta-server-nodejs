import { assertEx } from '@xylabs/assert'
import { ArchivistWrapper } from '@xyo-network/archivist-wrapper'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/http-bridge'
import { LRUCache } from 'lru-cache'

type CacheValue = [bridge: HttpBridge, archivist: ArchivistWrapper]

const name = ['Archivist']
const schema = HttpBridgeConfigSchema
const security = { allowAnonymous: true }

const ttl = 1000 * 60 * 60 // 1 hour in MS
const cache = new LRUCache<string, CacheValue>({ max: 5, ttl })

export const getArchivistForDomain = async (domain: string): Promise<ArchivistWrapper> => {
  const value = cache.get(domain)
  if (value) {
    const [, archivist] = value
    if (archivist) return archivist
  }
  const bridge = await HttpBridge.create({ config: { nodeUrl: `${domain}/node`, schema, security } })
  const resolved = await bridge.downResolver.resolve({ name })
  const mod = assertEx(resolved.pop(), `Failed to load module [${name}]`)
  const archivist = ArchivistWrapper.wrap(mod)
  cache.set(domain, [bridge, archivist])
  return archivist
}
