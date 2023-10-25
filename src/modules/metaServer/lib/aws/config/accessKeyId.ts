import { hasEnvVar, tryGetEnvVar } from '../../env'

/**
 * Checks if the AWS_ACCESS_KEY_ID environment variable is defined
 * @returns true if the AWS_ACCESS_KEY_ID environment variable is defined
 */
export const hasAccessKeyId = (): boolean => hasEnvVar('AWS_ACCESS_KEY_ID')

/**
 * Checks if the AWS_ACCESS_KEY_ID environment variable is defined
 * @returns true if the AWS_ACCESS_KEY_ID environment variable is defined
 */
export const getAccessKeyId = (): string | undefined => tryGetEnvVar('AWS_ACCESS_KEY_ID')
