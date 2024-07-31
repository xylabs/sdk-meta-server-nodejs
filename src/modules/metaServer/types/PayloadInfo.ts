import { HashInfo } from './HashInfo.js'

export interface PayloadInfo extends HashInfo {
  apiDomain: string
  path: string
}
