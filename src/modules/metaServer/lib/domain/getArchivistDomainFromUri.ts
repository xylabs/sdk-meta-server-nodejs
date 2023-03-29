import { parse } from 'querystring'
import { URL } from 'url'

export const networkToArchivistUri: Record<string, string> = {
  kerplunk: 'https://beta.api.archivist.xyo.network',
  local: 'http://localhost:8080',
  main: 'https://api.archivist.xyo.network',
}

export const originToArchivistUri: Record<string, string> = {
  'http://localhost:3000': 'http://localhost:8080',
  'https://beta.explore.xyo.network': 'https://beta.api.archivist.xyo.network',
  'https://beta.node.xyo.network': 'https://beta.api.archivist.xyo.network',
  'https://explore.xyo.network': 'https://api.archivist.xyo.network',
  'https://node.xyo.network': 'https://api.archivist.xyo.network',
}

const fromQuery = (parsed: URL): string | undefined => {
  try {
    const queryParams = parse(parsed.search.substring(1))
    const network = queryParams?.network as string | undefined
    if (network) {
      return networkToArchivistUri[network]
    }
  } catch (error) {
    console.log(error)
  }
  return undefined
}

const fromOrigin = (origin: string): string | undefined => {
  return originToArchivistUri[origin]
}

export const getArchivistDomainFromUri = (uri: string): string => {
  try {
    const parsed = new URL(uri)
    return fromQuery(parsed) || fromOrigin(parsed.origin) || networkToArchivistUri['main']
  } catch (error) {
    console.log(error)
  }
  return networkToArchivistUri['main']
}
