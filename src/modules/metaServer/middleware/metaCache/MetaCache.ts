import { Meta } from '@xyo-network/sdk-meta'

export interface MetaCache {
  entries(): [string, string][]
  get(key: string): string | undefined
  keys(): string[]
  patch(key: string, value: Meta | string): void
  set(key: string, value: Meta | string): void
  values(): string[]
}
