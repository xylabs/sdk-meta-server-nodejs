import { ExplorerArchivistBlockInfo } from '../../types'

export const isEnoughInfoToRetrieveBlock = (info: ExplorerArchivistBlockInfo): boolean => {
  return info.archive && info.hash && info.type ? true : false
}
