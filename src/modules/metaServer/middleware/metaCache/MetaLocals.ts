import { NoLocals } from '@xylabs/sdk-api-express-ecs'
import { Meta } from '@xyo-network/sdk-meta'

export type MetaLocals = NoLocals & { meta?: Meta }
