import { join } from 'node:path'

import { format } from 'date-fns'

const root = './puppeteer/cache'

/**
 * Ensures we don't bloat the cache with too many entries and
 * slowing down rendering by creating a new one every hour
 * @returns User data dir including ./puppeteer/cache/2023-07-12-14
 */
export const getUserDataDir = () => join(root, format(new Date(), 'yyyy-MM-dd-HH'))
