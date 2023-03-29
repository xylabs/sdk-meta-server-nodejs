import { HashInfo } from '../../types'

const pattern = /(?<hash>[a-f0-9]{32})/

export const getHashInfoFromUri = (uri: string): HashInfo => {
  const value = pattern.exec(uri)
  const hash = value?.groups?.hash
  return { hash }
}
