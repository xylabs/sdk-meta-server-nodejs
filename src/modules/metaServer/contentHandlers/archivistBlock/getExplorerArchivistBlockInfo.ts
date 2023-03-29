import { getArchivistDomainFromUri, getHashInfoFromUri } from '../../lib'
import { ExplorerArchivistBlockInfo } from '../../types'

export const getExplorerArchivistBlockInfo = (path: string): ExplorerArchivistBlockInfo => {
  const apiDomain = getArchivistDomainFromUri(path)
  const { archive, hash, type } = getHashInfoFromUri(path)
  return { apiDomain, archive, hash, path, type }
}
