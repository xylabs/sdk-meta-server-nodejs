import { S3ClientConfig } from '@aws-sdk/client-s3'
import { Promisable } from '@xylabs/promise'
import { lookup } from 'mime-types'

import { S3Store } from '../store'

/**
 * A file to be stored in the repository. Striving for similarity to the Browser
 * File interface. If not to enable easy migration to the browser, at least to
 * make it easier to understand initially.
 * https://developer.mozilla.org/en-US/docs/Web/API/File
 */
export interface RepositoryFile {
  /**
   * The file data.
   */
  data: Promisable<ArrayBuffer>
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
  addFile(file: RepositoryFile): Promise<void>
  /**
   * Finds a file in the repository.
   * @param uri The URI of the file to find.
   * @returns The file, if found. Otherwise, undefined.
   */
  findFile(uri: string): Promise<RepositoryFile | undefined>
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
  async addFile(file: RepositoryFile): Promise<void> {
    const key = file.uri
    const value = new Uint8Array(await file.data)
    // If contentType isn't provided, determine it from the file uri (which should have the extension)
    const type = file.type || lookup(file.uri) || 'application/octet-stream'
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
    const type = lookup(uri) || 'application/octet-stream'
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
