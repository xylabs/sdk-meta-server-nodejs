import { HashInfo } from './HashInfo'

export interface PayloadInfo extends HashInfo {
  apiDomain: string
  path: string
}
