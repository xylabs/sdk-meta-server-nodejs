import { getAwsS3ClientConfig, getBucket, hasBucket } from '../../aws'
import { FileRepository } from './FileRepository'
import { MemoryFileRepository } from './memory'
import { S3FileRepository } from './s3'

let repository: FileRepository | undefined

/**
 * Gets a file repository. If AWS S3 client config is provided, an S3 file
 * repository is returned. Otherwise, a memory file repository is returned.
 * @returns A file repository
 */
export const getFileRepository: () => FileRepository = () => {
  if (repository === undefined) {
    if (hasBucket()) {
      console.log('Using S3 file repository')
      repository = new S3FileRepository(getBucket(), getAwsS3ClientConfig())
    } else {
      console.log('Using Memory file repository')
      repository = new MemoryFileRepository()
    }
  }
  return repository
}
