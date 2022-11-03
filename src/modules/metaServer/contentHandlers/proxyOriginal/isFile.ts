import { stat } from 'fs/promises'

/**
 * A wrapper around the Node.js file stats package to
 * prevent the undesired behavior of throwing if the
 * supplied path doesn't exist.
 * @param path The path to the potential file
 * @returns True if the path exists and is a file, false otherwise
 */
export const isFile = async (path: string) => {
  try {
    // NOTE: Stat throws if file doesn't exist
    return (await stat(path)).isFile()
  } catch (error) {
    return false
  }
}
