import { S3ClientConfig } from '@aws-sdk/client-s3'
import { assertEx } from '@xylabs/assert'

import { getAccessKeyId, getRegionOrDefault, getSecretAccessKey } from '../config'

export const getAwsS3ClientConfig: () => S3ClientConfig = () => {
  return {
    credentials: {
      accessKeyId: assertEx(getAccessKeyId()),
      secretAccessKey: assertEx(getSecretAccessKey()),
    },
    region: getRegionOrDefault(),
  }
}
