import type { HashInfo } from '../../types/index.ts'

// TODO: Something more intelligent than just same length/characters
const pattern = /(?<hash>[\da-f]{64})/

export const getHashInfoFromUri = (uri: string): HashInfo => {
  const value = pattern.exec(uri)
  const hash = value?.groups?.hash
  return { hash }
}
