/**
 * Determines the default AWS S3 bucket to use.
 * @returns The default AWS S3 bucket to use.
 */
export const getDefaultBucket = () => {
  return process.env.AWS_S3_BUCKET || process.env.PUBLIC_ORIGIN || 'meta-server'
}

/**
 * Determines the default AWS S3 bucket to use for testing.
 * @returns The default AWS S3 bucket to use for testing.
 */
export const getDefaultTestBucket = () => {
  return process.env.AWS_S3_TEST_BUCKET || 'meta-server-unit-tests'
}
