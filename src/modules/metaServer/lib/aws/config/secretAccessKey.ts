import { getEnvVar, hasEnvVar } from '../../env'

/**
 * Checks if the AWS_SECRET_ACCESS_KEY environment variable is defined
 * @returns true if the AWS_SECRET_ACCESS_KEY environment variable is defined
 */
export const hasSecretAccessKey = (): boolean => hasEnvVar('AWS_SECRET_ACCESS_KEY')

/**
 * Checks if the AWS_SECRET_ACCESS_KEY environment variable is defined
 * @returns true if the AWS_SECRET_ACCESS_KEY environment variable is defined
 */
export const getSecretAccessKey = (): string | undefined => getEnvVar('AWS_SECRET_ACCESS_KEY')
