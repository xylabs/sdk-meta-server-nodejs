import { getAwsS3ClientConfig, hasAwsS3ClientConfig } from '../../aws'
import { FileRepository } from './FileRepository'
import { MemoryFileRepository } from './memory'
import { S3FileRepository } from './s3'

export const getFileRepository: () => FileRepository = () => {
  if (hasAwsS3ClientConfig()) {
    return new S3FileRepository('', getAwsS3ClientConfig())
  }
  return new MemoryFileRepository()
}
