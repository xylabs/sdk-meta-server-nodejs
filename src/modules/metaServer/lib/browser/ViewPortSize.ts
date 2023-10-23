export interface ViewPortSize {
  height: number
  width: number
}

// https://developers.facebook.com/docs/sharing/best-practices/
// https://developers.facebook.com/docs/sharing/webmasters/images/
export const defaultViewportSize: ViewPortSize = {
  height: 630,
  width: 1200,
}
