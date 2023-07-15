import { Meta } from '@xyo-network/sdk-meta'
import { LRUCache } from 'lru-cache'

import { MetaCache } from './MetaCache'

const metaCache = new LRUCache<string, Meta>({ max: 1000 })

export const getMetaCache = (): MetaCache => metaCache
