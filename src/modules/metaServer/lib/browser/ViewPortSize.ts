export interface ViewPortSize {
  height: number
  width: number
}

// NOTE: Should we use 16:9 ratio instead?
// https://developers.facebook.com/docs/sharing/best-practices/
export const defaultViewportSize: ViewPortSize = {
  height: 1080,
  width: 1080,
}
