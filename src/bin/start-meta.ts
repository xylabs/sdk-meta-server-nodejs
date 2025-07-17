import { tryParseInt } from '@xylabs/express'

import { metaServer } from '../modules/index.ts'

const port = tryParseInt(process.env.PORT) || 8083
metaServer(port)
