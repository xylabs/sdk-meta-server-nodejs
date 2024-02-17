const localhost = 'localhost'
// [::1] is the IPv6 localhost address.
const ipv6Localhost = '[::1]'
// 127.0.0.0/8 are considered localhost for IPv4.
const ipv4LocalhostRegex = /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})){3}/

const isStringLocalhost = (hostname: string): boolean => {
  if (ipv4LocalhostRegex.test(hostname) || hostname.startsWith(localhost) || hostname.startsWith(ipv6Localhost)) return true
  return false
}

export const isLocalhost = (uri: string): boolean => {
  if (isStringLocalhost(uri)) return true
  try {
    const parsed = new URL(uri)
    const { hostname } = parsed
    if (isStringLocalhost(hostname)) return true
  } catch {
    return false
  }
  return false
}
