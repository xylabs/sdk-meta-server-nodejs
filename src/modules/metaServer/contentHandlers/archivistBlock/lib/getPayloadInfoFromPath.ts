import { getArchivistDomainFromUri, getHashInfoFromUri } from '../../../lib'
import { PayloadInfo } from '../../../types'

export const getPayloadInfoFromPath = (path: string): PayloadInfo => {
  const apiDomain = getArchivistDomainFromUri(path)
  const { hash } = getHashInfoFromUri(path)
  return { apiDomain, hash, path }
}
