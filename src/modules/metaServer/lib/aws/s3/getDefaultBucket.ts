import { generateEnvVarHelpers } from '../../env'

/**
 * Determines the default AWS S3 bucket to use.
 */
export const { hasEnvVar: hasDefaultBucket, tryGetEnvVar: tryGetDefaultBucket, getEnvVar: getDefaultBucket } = generateEnvVarHelpers('AWS_S3_BUCKET')

/**
 * Determines the default AWS S3 bucket to use for testing.
 * @returns The default AWS S3 bucket to use for testing.
 */
export const getDefaultTestBucket = () => {
  return process.env.AWS_S3_TEST_BUCKET || 'meta-server-unit-tests'
}
