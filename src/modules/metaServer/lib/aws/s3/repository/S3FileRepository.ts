import { S3ClientConfig } from '@aws-sdk/client-s3'
import { lookup } from 'mime-types'

import { S3Store } from '../store'

/**
 * A file to be stored in S3.
 */
export interface File {
  /**
   * The content type of the file. If not provided, we'll try to determine it from the file ID.
   */
  contentType?: string
  /**
   * The file data.
   */
  data: Uint8Array
  /**
   * The file URI with extension.
   */
  uri: string
}

export class S3FileRepository {
  private store: S3Store

  constructor(bucketName: string, config: S3ClientConfig) {
    this.store = new S3Store(bucketName, config)
  }

  /**
   * Adds a file to the repository.
   * @param file The file to add.
   */
  async addFile(file: File): Promise<void> {
    // If contentType isn't provided, determine it from the file uri (which should have the extension)
    if (!file.contentType) {
      const contentType = lookup(file.uri) || 'application/octet-stream'
      file.contentType = contentType
    }
    await this.store.set(file.uri, file.data, file.contentType)
  }

  /**
   * Finds a file in the repository.
   * @param uri The URI of the file to find.
   * @returns The file, if found. Otherwise, undefined.
   */
  async findFile(uri: string): Promise<File | undefined> {
    const data = await this.store.get(uri)
    if (!data) {
      return undefined
    }
    const contentType = lookup(uri) || 'application/octet-stream'
    return { contentType, data, uri }
  }

  /**
   * Removes a file from the repository.
   * @param uri The URI of the file to remove.
   */
  async removeFile(uri: string): Promise<void> {
    await this.store.delete(uri)
  }
}
