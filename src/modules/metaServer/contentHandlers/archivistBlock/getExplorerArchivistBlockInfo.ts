import { getArchivistDomainFromExploreUri, getHashInfoFromUri } from '../../lib'
import { ExplorerArchivistBlockInfo } from '../../types'

export const getExplorerArchivistBlockInfo = (path: string): ExplorerArchivistBlockInfo => {
  const apiDomain = getArchivistDomainFromExploreUri(path)
  const { archive, hash, type } = getHashInfoFromUri(path)
  return { apiDomain, archive, hash, path, type }
}
