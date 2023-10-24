export interface Cache<T> {
  delete(key: string): Promise<void> | void
  get(key: string): Promise<T | undefined> | T | undefined
  set(key: string, value: Promise<T>): Promise<void> | void
}
