import { join } from '../../../../lib'

export const getPreviewUrl = (url: string): string => join(url, 'preview')
