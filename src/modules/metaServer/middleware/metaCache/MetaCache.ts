import type { Meta } from '@xylabs/sdk-meta'

export interface MetaCache {
  entries(): [string, string][]
  get(key: string): string | undefined
  has(key: string): boolean
  keys(): string[]
  patch(key: string, value: Meta | string): void
  set(key: string, value: Meta | string): void
  values(): string[]
}
