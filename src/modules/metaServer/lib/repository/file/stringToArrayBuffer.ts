export const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder() // Typically UTF-8 encoding by default
  const uint8Array = encoder.encode(str)
  return uint8Array.buffer
}
