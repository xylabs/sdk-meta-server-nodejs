export interface ImageCache {
  get(key: string): Buffer | undefined
  set(key: string, value: Buffer): void
}
