import { generateEnvVarHelpers } from '../../env/index.ts'

/**
 * Determines the default AWS S3 bucket to use.
 */
export const { hasEnvVar: hasBucket, tryGetEnvVar: tryGetBucket, getEnvVar: getBucket } = generateEnvVarHelpers('AWS_S3_BUCKET')

/**
 * Determines the default AWS S3 bucket to use for testing.
 * @returns The default AWS S3 bucket to use for testing.
 */
export const getDefaultTestBucket = () => {
  return process.env.AWS_S3_TEST_BUCKET || 'meta-server-unit-tests'
}
