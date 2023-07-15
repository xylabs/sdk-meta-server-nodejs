import { MetaCache } from './MetaCache'
import { SimpleMetaCache } from './SimpleMetaCache'

const metaCache = new SimpleMetaCache()

export const getMetaCache = (): MetaCache => metaCache
