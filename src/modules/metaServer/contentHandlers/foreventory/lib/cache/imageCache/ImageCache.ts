export interface ImageCache {
  get(key: string): Promise<Buffer> | undefined
  set(key: string, value: Promise<Buffer>): void
}
