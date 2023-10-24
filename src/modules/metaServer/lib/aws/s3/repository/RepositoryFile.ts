import { Promisable } from '@xylabs/promise'

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
