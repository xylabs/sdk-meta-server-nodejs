export interface Cache<T> {
  delete(key: string): void
  get(key: string): Promise<T | undefined> | undefined
  set(key: string, value: Promise<T | undefined>): void
}
