export interface PageCache {
  get(key: string): string | undefined
  set(key: string, value: string): void
}
