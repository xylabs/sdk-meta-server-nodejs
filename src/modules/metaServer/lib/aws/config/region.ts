import { getEnvVar, hasEnvVar } from '../../env'

/**
 * Checks if the AWS_REGION environment variable is defined
 * @returns true if the AWS_REGION environment variable is defined
 */
export const hasRegion = (): boolean => hasEnvVar('AWS_REGION')

/**
 * Checks if the AWS_REGION environment variable is defined
 * @returns true if the AWS_REGION environment variable is defined
 */
export const getRegion = (): string | undefined => getEnvVar('AWS_REGION')

/**
 * Checks if the AWS_REGION environment variable is defined
 * @returns true if the AWS_REGION environment variable is defined
 */
export const getRegionOrDefault = (): string | undefined => getRegion() || 'us-east-1'
