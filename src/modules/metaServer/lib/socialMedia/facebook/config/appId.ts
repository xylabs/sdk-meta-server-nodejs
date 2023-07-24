/**
 * Checks if the FB_APP_ID environment variable is defined
 * @returns true if the FB_APP_ID environment variable is defined
 */
export const hasFacebookAppId = (): boolean => process.env.FB_APP_ID !== undefined

/**
 * The Facebook App ID or undefined if not defined
 * @returns The FB_APP_ID environment variable
 */
export const getFacebookAppId = (): string | undefined => process.env.FB_APP_ID
