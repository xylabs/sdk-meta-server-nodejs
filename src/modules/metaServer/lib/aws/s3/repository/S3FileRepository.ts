import { S3ClientConfig } from '@aws-sdk/client-s3'
import { lookup } from 'mime-types'

import { S3Store } from '../store'

/**
 * A file to be stored in the repository.
 */
export interface File {
  /**
   * The file data.
   */
  data: ArrayBuffer
  /**
   * The content type of the file. If not provided, we'll try to determine it from the file ID.
   */
  readonly type?: string
  /**
   * The file URI with extension.
   */
  readonly uri: string
}

/**
 * A repository for storing files.
 */
export interface FileRepository {
  /**
   * Adds a file to the repository.
   * @param file The file to add.
   */
  addFile(file: File): Promise<void>
  /**
   * Finds a file in the repository.
   * @param uri The URI of the file to find.
   * @returns The file, if found. Otherwise, undefined.
   */
  findFile(uri: string): Promise<File | undefined>
  /**
   * Removes a file from the repository.
   * @param uri The URI of the file to remove.
   */
  removeFile(uri: string): Promise<void>
}

export class S3FileRepository implements FileRepository {
  private store: S3Store

  constructor(bucketName: string, config: S3ClientConfig) {
    this.store = new S3Store(bucketName, config)
  }

  /**
   * Adds a file to the repository.
   * @param file The file to add.
   */
  async addFile(file: File): Promise<void> {
    const key = file.uri
    const value = new Uint8Array(file.data)
    // If contentType isn't provided, determine it from the file uri (which should have the extension)
    const type = file.type || lookup(file.uri) || 'application/octet-stream'
    await this.store.set(key, value, type)
  }

  /**
   * Finds a file in the repository.
   * @param uri The URI of the file to find.
   * @returns The file, if found. Otherwise, undefined.
   */
  async findFile(uri: string): Promise<File | undefined> {
    const result = await this.store.get(uri)
    if (!result) {
      return undefined
    }
    const type = lookup(uri) || 'application/octet-stream'
    const data: ArrayBuffer = result.buffer
    const file: File = { data, type, uri }
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
