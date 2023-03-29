import { HashInfo } from '../../types'

// TODO: Something more intelligent than just same length/characters
const pattern = /(?<hash>[a-f0-9]{64})/

export const getHashInfoFromUri = (uri: string): HashInfo => {
  const value = pattern.exec(uri)
  const hash = value?.groups?.hash
  return { hash }
}
