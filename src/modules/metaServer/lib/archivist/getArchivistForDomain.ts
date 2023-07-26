import { HDWallet } from '@xyo-network/account'
import { ArchivistInstance, asArchivistInstance } from '@xyo-network/archivist-model'
import { HttpBridge, HttpBridgeConfigSchema } from '@xyo-network/http-bridge'
import { LRUCache } from 'lru-cache'

type CacheValue = [bridge: HttpBridge, archivist: ArchivistInstance]

const name = 'Archivist'
const schema = HttpBridgeConfigSchema
const security = { allowAnonymous: true }

const ttl = 1000 * 60 * 60 // 1 hour in MS
const cache = new LRUCache<string, CacheValue>({ max: 5, ttl })

export const getArchivistForDomain = async (domain: string): Promise<ArchivistInstance> => {
  const value = cache.get(domain)
  if (value) {
    const [, archivist] = value
    if (archivist) return archivist
  }
  const bridge = await HttpBridge.create({ account: await HDWallet.random(), config: { nodeUrl: `${domain}/node`, schema, security } })
  const resolved = await bridge.resolve(name)
  console.log(`getArchivistForDomain: ${JSON.stringify(JSON.stringify(resolved?.config, null, 2))}`)
  const archivist = asArchivistInstance(resolved, `Failed to load module [${name}]`)
  cache.set(domain, [bridge, archivist])
  return archivist
}
