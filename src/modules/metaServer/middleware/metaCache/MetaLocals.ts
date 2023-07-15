import { NoLocals } from '@xylabs/sdk-api-express-ecs'
import { Meta } from '@xyo-network/sdk-meta'

interface MetaCacheProperties {
  /**
   * Returns the HTML metadata for the current response
   */
  getResponseMeta(): Meta
  /**
   * Patches the HTML metadata for the current response
   */
  patchResponseMeta(meta: Meta): void
}

export type MetaLocals = NoLocals & MetaCacheProperties
