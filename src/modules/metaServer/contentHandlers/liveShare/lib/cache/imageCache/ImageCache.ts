export interface ImageCache {
  delete(key: string): void
  get(key: string): Promise<Buffer> | undefined
  set(key: string, value: Promise<Buffer> | undefined): void
}
