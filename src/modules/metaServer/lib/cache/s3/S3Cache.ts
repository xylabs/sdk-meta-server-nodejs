import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'

import { Cache } from '../Cache'

export class S3Cache<T> implements Cache<T> {
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

  async get(key: string): Promise<T | undefined> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    })

    try {
      const data = await this.s3.send(command)
      if (data.Body) {
        return new Promise((resolve, reject) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const chunks: any[] = []
          data.Body?.on('data', (chunk) => chunks.push(chunk))
          data.Body?.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())))
          data.Body?.on('error', reject)
        }) as Promise<T>
      }
    } catch (error) {
      if ((error as { name?: string })?.name === 'NoSuchKey') {
        return undefined
      }
      throw error
    }
  }

  async set(key: string, value: Promise<T> | undefined): Promise<void> {
    if (!value) {
      await this.delete(key)
      return
    }

    const resolvedValue = await value
    const command = new PutObjectCommand({
      Body: JSON.stringify(resolvedValue),
      Bucket: this.bucketName,
      ContentType: 'application/json',
      Key: key,
    })

    await this.s3.send(command)
  }
}
