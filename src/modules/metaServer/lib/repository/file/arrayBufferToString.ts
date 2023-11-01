export const arrayBufferToString = (buffer: ArrayBuffer): string => {
  const decoder = new TextDecoder() // Typically UTF-8 decoding by default
  return decoder.decode(buffer)
}
