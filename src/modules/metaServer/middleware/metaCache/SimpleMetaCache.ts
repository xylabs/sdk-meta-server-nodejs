import { mergeDocumentHead, Meta, metaBuilder } from '@xyo-network/sdk-meta'
import { LRUCache } from 'lru-cache'

import { MetaCache } from './MetaCache'

const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
</head>
</html>`

export class SimpleMetaCache implements MetaCache {
  protected readonly metaCache = new LRUCache<string, string>({ max: 1000 })

  public entries(): [string, string][] {
    const values = this.metaCache.entries()
    const sorted = Array.from(values)
      .filter((value): value is [string, string] => typeof value[0] === 'string')
      .sort(([a], [b]) => a.localeCompare(b))
    return sorted
  }
  public get(key: string): string | undefined {
    return this.metaCache.get(key)
  }
  public keys(): string[] {
    return this.entries().map(([key]) => key)
  }
  public patch(key: string, value: Meta | string) {
    const incoming = typeof value === 'string' ? value : metaBuilder(defaultHtml, value)
    const existing = this.metaCache.get(key)
    if (existing) {
      const merged = mergeDocumentHead(existing, incoming)
      this.metaCache.set(key, merged)
    } else {
      this.metaCache.set(key, incoming)
    }
  }
  public set(key: string, value: Meta | string) {
    const incoming = typeof value === 'string' ? value : metaBuilder(defaultHtml, value)
    this.metaCache.set(key, incoming)
  }
  public values(): string[] {
    return this.entries().map(([_, value]) => value)
  }
}
