import { getAwsS3ClientConfig, getBucket, hasBucket, tryGetBucket } from '../../aws/index.ts'
import { FileRepository } from './FileRepository.ts'
import { MemoryFileRepository } from './memory/index.ts'
import { S3FileRepository } from './s3/index.ts'

let repository: FileRepository | undefined

/**
 * Gets a file repository. If AWS S3 client config is provided, an S3 file
 * repository is returned. Otherwise, a memory file repository is returned.
 * @returns A file repository
 */
export const getFileRepository: () => FileRepository = () => {
  if (repository === undefined) {
    console.log(`[getFileRepository][init] Configuration for S3 bucket: ${tryGetBucket()}`)
    if (hasBucket()) {
      console.log('[getFileRepository][init] Using S3 file repository')
      repository = new S3FileRepository(getBucket(), getAwsS3ClientConfig())
    } else {
      console.log('[getFileRepository][init] Using Memory file repository')
      repository = new MemoryFileRepository()
    }
  }
  return repository
}
