export type QueryParamsDict = { [param: string]: string }

export const addQueryParam = (url: string, param: string, value: string): string => {
  const parsed = new URL(url)
  parsed.searchParams.append(param, value)
  return parsed.toString()
}

export const addQueryParams = (url: string, paramsDict: QueryParamsDict): string => {
  const parsed = new URL(url)
  Object.entries(paramsDict).map(([param, value]) => parsed.searchParams.append(param, value))
  return parsed.toString()
}

export const removeQueryParam = (url: string, param: string): string => {
  const parsed = new URL(url)
  parsed.searchParams.delete(param)
  return parsed.toString()
}

export const removeQueryParams = (url: string, paramsDict: QueryParamsDict): string => {
  const parsed = new URL(url)
  Object.entries(paramsDict).map(([param, value]) => parsed.searchParams.delete(param, value))
  return parsed.toString()
}
