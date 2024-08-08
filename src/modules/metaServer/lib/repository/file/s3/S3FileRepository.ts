import { S3ClientConfig } from '@aws-sdk/client-s3'

import { S3Store } from '../../../aws/index.ts'
import { getContentType } from '../../../file/index.ts'
import { FileRepository } from '../FileRepository.ts'
import { RepositoryFile } from '../RepositoryFile.ts'

export class S3FileRepository implements FileRepository {
  private store: S3Store

  constructor(bucketName: string, config: S3ClientConfig) {
    this.store = new S3Store(bucketName, config)
  }

  /**
   * Adds a file to the repository.
   * @param file The file to add.
   */
  async addFile(file: RepositoryFile): Promise<void> {
    const key = file.uri
    const value = new Uint8Array(await file.data)
    // If contentType isn't provided, determine it from the file uri (which should have the extension)
    const type = file.type || getContentType(file.uri) || 'application/octet-stream'
    await this.store.set(key, value, type)
  }

  /**
   * Finds a file in the repository.
   * @param uri The URI of the file to find.
   * @returns The file, if found. Otherwise, undefined.
   */
  async findFile(uri: string): Promise<RepositoryFile | undefined> {
    const result = await this.store.get(uri)
    if (!result) {
      return undefined
    }
    const type = getContentType(uri) || 'application/octet-stream'
    const data: ArrayBuffer = result.buffer
    const file: RepositoryFile = { data, type, uri }
    return file
  }

  /**
   * Removes a file from the repository.
   * @param uri The URI of the file to remove.
   */
  async removeFile(uri: string): Promise<void> {
    await this.store.delete(uri)
  }
}
