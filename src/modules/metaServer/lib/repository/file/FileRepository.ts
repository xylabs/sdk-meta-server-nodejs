import { RepositoryFile } from './RepositoryFile.ts'

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
