import { HashInfo, HashType } from '../../types'

const pattern = /archive\/(?<archive>[a-z0-9-]+)\/(?<type>block|payload)\/hash\/(?<hash>[a-z0-9]+)/

export const getHashInfoFromUri = (uri: string): HashInfo => {
  const value = pattern.exec(uri)
  const archive = value?.groups?.archive
  const hash = value?.groups?.hash
  const type = value?.groups?.type as HashType | undefined
  return { archive, hash, type }
}
