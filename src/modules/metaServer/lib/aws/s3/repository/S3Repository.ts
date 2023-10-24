import { S3ClientConfig } from '@aws-sdk/client-s3'

// import { lookup } from 'mime-types'
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
   * The file URI.
   */
  uri: string
}

export class S3Repository {
  private store: S3Store

  constructor(bucketName: string, config: S3ClientConfig) {
    this.store = new S3Store(bucketName, config)
  }

  async addFile(file: File): Promise<void> {
    // If contentType isn't provided, determine it from the file ID (which should have the extension)
    if (!file.contentType) {
      const contentType = 'application/octet-stream'
      file.contentType = contentType
    }
    await this.store.set(file.uri, file.data, file.contentType)
  }

  async findFile(uri: string): Promise<File | undefined> {
    const data = await this.store.get(uri)
    if (!data) {
      return undefined
    }
    const contentType = 'application/octet-stream'
    return { contentType, data, uri }
  }

  async removeFile(uri: string): Promise<void> {
    await this.store.delete(uri)
  }
}
