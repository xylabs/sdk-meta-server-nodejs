import { hasEnvVar, tryGetEnvVar } from '../../../env'

/**
 * Checks if the FB_APP_SECRET environment variable is defined
 * @returns true if the FB_APP_SECRET environment variable is defined
 */
export const hasFacebookAppSecret = (): boolean => hasEnvVar('FB_APP_SECRET')

/**
 * The Facebook App SECRET or undefined if not defined
 * @returns The FB_APP_SECRET environment variable
 */
export const getFacebookAppSecret = (): string | undefined => tryGetEnvVar('FB_APP_SECRET')
