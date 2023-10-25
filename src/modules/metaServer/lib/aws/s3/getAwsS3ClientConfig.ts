import { S3ClientConfig } from '@aws-sdk/client-s3'
import { assertEx } from '@xylabs/assert'

import { getRegionOrDefault, tryGetAccessKeyId, tryGetSecretAccessKey } from '../config'

export const getAwsS3ClientConfig: () => S3ClientConfig = () => {
  return {
    credentials: {
      accessKeyId: assertEx(tryGetAccessKeyId()),
      secretAccessKey: assertEx(tryGetSecretAccessKey()),
    },
    region: getRegionOrDefault(),
  }
}
