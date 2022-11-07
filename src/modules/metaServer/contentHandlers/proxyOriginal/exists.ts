import { stat } from 'fs/promises'

/**
 * A wrapper around the Node.js file stats package to
 * prevent the undesired behavior of throwing if the
 * supplied path doesn't exist.
 * @param path The path to the potential file/directory
 * @returns True if the path exists and is a file/directory, false otherwise
 */
export const exists = async (path: string) => {
  try {
    // NOTE: Stat throws if file doesn't exist
    const stats = await stat(path)
    return stats.isFile() || stats.isDirectory()
  } catch (error) {
    return false
  }
}
