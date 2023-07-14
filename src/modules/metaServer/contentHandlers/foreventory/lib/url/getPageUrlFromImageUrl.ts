// Create a regular expression that matches a SHA-256 hash and everything after it
const regex = new RegExp('([a-fA-F0-9]{64}).*')

export const getPageUrlFromImageUrl = (url: string): string => {
  // Replace the matched substring with the hash itself
  return url.replace(regex, '$1')
}
