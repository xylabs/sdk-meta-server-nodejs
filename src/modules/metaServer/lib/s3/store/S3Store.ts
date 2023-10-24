import { DeleteObjectCommand, GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'

export class S3Store {
  private bucketName: string
  private s3: S3Client

  constructor(bucketName: string, config: S3ClientConfig) {
    this.bucketName = bucketName
    this.s3 = new S3Client(config)
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })
    await this.s3.send(command)
  }

  async get(key: string): Promise<Uint8Array | undefined> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    try {
      const data: GetObjectCommandOutput = await this.s3.send(command)
      const transform = data.Body?.transformToByteArray
      if (transform) {
        return await transform()
      }
    } catch (error) {
      if ((error as { name?: string })?.name === 'NoSuchKey') {
        return undefined
      }
      throw error
    }
    return undefined
  }

  async set(
    key: string,
    value?: Promise<Uint8Array | undefined>,
    contentType: string = 'application/octet-stream',
    contentEncoding: string = 'gzip',
  ): Promise<void> {
    // If they handed us undefined, we should delete the key
    if (!value) {
      await this.delete(key)
      return
    }
    const resolvedValue = await value
    // TODO: If the promise handed to us resolved to undefined, we should delete the key
    // if (!resolvedValue) {
    //   await this.delete(key)
    //   return
    // }
    const command = new PutObjectCommand({
      Body: resolvedValue,
      Bucket: this.bucketName,
      ContentEncoding: contentEncoding,
      ContentType: contentType,
      Key: key,
    })

    await this.s3.send(command)
  }
}
