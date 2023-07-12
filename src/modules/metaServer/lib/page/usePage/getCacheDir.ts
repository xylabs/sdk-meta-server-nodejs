import { format } from 'date-fns'
import { join } from 'path'

const root = './puppeteer/cache'

export const getCacheDir = () => join(root, format(new Date(2014, 1, 11), 'yyyy-MM-dd'))
