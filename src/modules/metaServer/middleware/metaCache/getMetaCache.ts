import { LruMetaCache } from './LruMetaCache'
import { MetaCache } from './MetaCache'

const metaCache = new LruMetaCache()

export const getMetaCache = (): MetaCache => metaCache
