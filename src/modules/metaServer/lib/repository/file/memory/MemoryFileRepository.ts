import { FileRepository } from '../FileRepository'
import { RepositoryFile } from '../RepositoryFile'

export class MemoryFileRepository implements FileRepository {
  addFile(file: RepositoryFile): Promise<void> {
    throw new Error('Method not implemented.')
  }
  findFile(uri: string): Promise<RepositoryFile | undefined> {
    throw new Error('Method not implemented.')
  }
  removeFile(uri: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
