import type { S3ClientConfig } from '@aws-sdk/client-s3'

import {
  getAccessKeyId, getRegionOrDefault, getSecretAccessKey, hasAccessKeyId, hasSecretAccessKey,
} from '../config/index.ts'

export const getAwsS3ClientConfig: () => S3ClientConfig = () => {
  const config: S3ClientConfig = { region: getRegionOrDefault() }
  if (hasAccessKeyId() && hasSecretAccessKey()) {
    config.credentials = {
      accessKeyId: getAccessKeyId(),
      secretAccessKey: getSecretAccessKey(),
    }
  }
  return config
}
