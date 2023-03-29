import { PayloadInfo } from '../../types'

export const isEnoughInfoToRetrievePayload = (info: PayloadInfo): boolean => {
  return info.hash ? true : false
}
