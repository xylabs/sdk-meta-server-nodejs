import { LRUCache } from 'lru-cache'

import { ImageCache } from './ImageCache'

const imageCache = new LRUCache<string, Buffer>({ max: 1000 })

export const getImageCache = (): ImageCache => imageCache
