import { DeleteObjectCommand, GetObjectCommand, GetObjectCommandOutput, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'

import { Cache } from '../Cache'

export class S3Cache implements Cache<Uint8Array> {
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
  }

  async set(key: string, value: Promise<Uint8Array>): Promise<void> {
    if (!value) {
      await this.delete(key)
      return
    }
    const resolvedValue = await value
    const command = new PutObjectCommand({
      Body: resolvedValue,
      Bucket: this.bucketName,
      ContentType: 'application/json',
      Key: key,
    })

    await this.s3.send(command)
  }
}
