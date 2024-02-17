import { URL } from 'node:url'
export const getDomainFromUri = (uri: string): string => {
  try {
    const parsed = new URL(uri)
    return `${parsed.protocol}//${parsed.host}`
  } catch {
    return ''
  }
}
