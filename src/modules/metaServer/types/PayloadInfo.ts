import type { HashInfo } from './HashInfo.ts'

export interface PayloadInfo extends HashInfo {
  apiDomain: string
  path: string
}
