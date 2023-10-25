import { getAwsS3ClientConfig, getDefaultBucket, hasAwsS3ClientConfig } from '../../aws'
import { FileRepository } from './FileRepository'
import { MemoryFileRepository } from './memory'
import { S3FileRepository } from './s3'

const repository: FileRepository = hasAwsS3ClientConfig()
  ? new S3FileRepository(getDefaultBucket(), getAwsS3ClientConfig())
  : new MemoryFileRepository()

/**
 * Gets a file repository. If AWS S3 client config is provided, an S3 file
 * repository is returned. Otherwise, a memory file repository is returned.
 * @returns A file repository
 */
export const getFileRepository: () => FileRepository = () => {
  return repository
}
