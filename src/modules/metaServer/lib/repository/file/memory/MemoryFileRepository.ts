import { LRUCache } from 'lru-cache'

import { FileRepository } from '../FileRepository'
import { RepositoryFile } from '../RepositoryFile'

export class MemoryFileRepository implements FileRepository {
  protected files = new LRUCache<string, RepositoryFile>({ max: 1000 })
  constructor() {}

  async addFile(file: RepositoryFile): Promise<void> {
    await file.data
    this.files.set(file.uri, file)
  }

  async findFile(uri: string): Promise<RepositoryFile | undefined> {
    if (this.files.has(uri)) {
      return await Promise.resolve(this.files.get(uri))
    }
  }
  removeFile(uri: string): Promise<void> {
    this.files.delete(uri)
    return Promise.resolve()
  }
}
