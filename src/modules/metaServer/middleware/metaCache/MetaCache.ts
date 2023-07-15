import { Meta } from '@xyo-network/sdk-meta'

export interface MetaCache {
  get(key: string): string | undefined
  patch(key: string, value: Meta | string): void
  set(key: string, value: Meta | string): void
}
