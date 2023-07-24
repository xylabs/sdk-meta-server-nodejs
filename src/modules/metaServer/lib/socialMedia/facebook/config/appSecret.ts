/**
 * Checks if the FB_APP_SECRET environment variable is defined
 * @returns true if the FB_APP_SECRET environment variable is defined
 */
export const hasFacebookAppSecret = (): boolean => process.env.FB_APP_SECRET !== undefined

/**
 * The Facebook App SECRET or undefined if not defined
 * @returns The FB_APP_SECRET environment variable
 */
export const getFacebookAppSecret = (): string | undefined => process.env.FB_APP_SECRET
