import { generateEnvVarHelpers } from '../../env'

/**
 * Checks if the AWS_DEFAULT_REGION environment variable is defined
 * @returns true if the AWS_DEFAULT_REGION environment variable is defined
 */
export const getRegionOrDefault = (): string | undefined => tryGetRegion() || 'us-east-1'

export const { hasEnvVar: hasRegion, tryGetEnvVar: tryGetRegion, getEnvVar: getRegion } = generateEnvVarHelpers('AWS_DEFAULT_REGION')
