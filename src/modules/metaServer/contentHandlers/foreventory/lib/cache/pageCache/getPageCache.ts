import { LRUCache } from 'lru-cache'

import { PageCache } from './PageCache'

const pageCache = new LRUCache<string, string>({ max: 1000 })

export const getPageCache = (): PageCache => pageCache