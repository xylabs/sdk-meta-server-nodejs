export const getDefaultBucket = () => {
  return process.env.AWS_S3_BUCKET || process.env.PUBLIC_ORIGIN || 'meta-server'
}

export const getDefaultTestBucket = () => {
  return process.env.AWS_S3_TEST_BUCKET || 'meta-server-unit-tests'
}
