import {
  summaryCardImageFromPage,
  summaryCardViewport,
  summaryCardWithLargeImageFromPage,
  summaryCardWithLargeImageViewport,
} from '../../../../lib/index.ts'

/**
 * If true, use the large, rectangular image card. If false, use the small,
 * square image card.
 */
export const useLargeImage = true

/**
 * The width & height of the image to generate
 */
export const { height, width } = useLargeImage ? summaryCardWithLargeImageViewport : summaryCardViewport

/**
 * The image type
 */
export const type = 'image/png'

/**
 * The image generator to use
 */
export const imageGenerator = useLargeImage ? summaryCardWithLargeImageFromPage : summaryCardImageFromPage
