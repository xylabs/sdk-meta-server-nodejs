import { getEnvVar, hasEnvVar } from '../../../env'

/**
 * Checks if the FB_APP_ID environment variable is defined
 * @returns true if the FB_APP_ID environment variable is defined
 */
export const hasFacebookAppId = (): boolean => hasEnvVar('FB_APP_ID')

/**
 * The Facebook App ID or undefined if not defined
 * @returns The FB_APP_ID environment variable
 */
export const getFacebookAppId = (): string | undefined => getEnvVar('FB_APP_ID')
