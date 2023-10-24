import { hasAccessKeyId, hasSecretAccessKey } from '../config'

/**
 * Checks if the enough information exists in the environment to create an AWS S3 client
 * @returns true enough information exists in the environment to create an AWS S3 client
 */
export const hasAwsS3ClientConfig = (): boolean => hasAccessKeyId() && hasSecretAccessKey()
