import { Cache } from '../Cache'

export interface ImageCache extends Cache<Buffer> {
  delete(key: string): void
  get(key: string): Promise<Buffer> | undefined
  set(key: string, value: Promise<Buffer> | undefined): void
}
