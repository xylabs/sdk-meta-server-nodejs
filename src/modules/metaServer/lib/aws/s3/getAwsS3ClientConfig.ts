import { S3ClientConfig } from '@aws-sdk/client-s3'

import { getAccessKeyId, getRegionOrDefault, getSecretAccessKey } from '../config'

export const getAwsS3ClientConfig: S3ClientConfig = () => ({
  credentials: {
    accessKeyId: getAccessKeyId(),
    secretAccessKey: getSecretAccessKey(),
  },
  region: getRegionOrDefault(),
})
