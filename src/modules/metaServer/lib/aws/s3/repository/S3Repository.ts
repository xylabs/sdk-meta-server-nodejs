import { S3ClientConfig } from '@aws-sdk/client-s3'
import { lookup } from 'mime-types' // Make sure to install the mime-types package

import { S3Store } from '../store'

export interface File {
  contentType?: string // Now optional, we can determine it from the file extension if not provided
  data: Uint8Array
  id: string
}

export class S3Repository {
  private store: S3Store

  constructor(bucketName: string, config: S3ClientConfig) {
    this.store = new S3Store(bucketName, config)
  }

  async addFile(file: File): Promise<void> {
    // If contentType isn't provided, determine it from the file ID (which should have the extension)
    if (!file.contentType) {
      const contentType = lookup(file.id) || 'application/octet-stream'
      file.contentType = contentType
    }
    await this.store.set(file.id, file.data, file.contentType)
  }

  async getFile(fileId: string): Promise<File | undefined> {
    const data = await this.store.get(fileId)
    if (!data) {
      return undefined
    }
    const contentType = lookup(fileId) || 'application/octet-stream'
    return {
      contentType: contentType,
      data: data,
      id: fileId,
    }
  }

  async removeFile(fileId: string): Promise<void> {
    await this.store.delete(fileId)
  }
}
