export type HashType = 'payload' | 'block'

const pattern = /archive\/(?<archive>[a-z0-9-]+)\/(?<type>block|payload)\/hash\/(?<hash>[a-z0-9]+)/

export interface HashInfo {
  archive?: string
  hash?: string
  type?: HashType
}

export const getHashInfoFromUri = (uri: string): HashInfo => {
  const value = pattern.exec(uri)
  const archive = value?.groups?.archive
  const hash = value?.groups?.hash
  const type = value?.groups?.type as HashType | undefined
  return { archive, hash, type }
}
