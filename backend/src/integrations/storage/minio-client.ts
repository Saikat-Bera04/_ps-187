import { Client } from 'minio';
import { config } from '../../config';

let minioClient: Client | null = null;

if (config.storageMode === 'minio') {
  minioClient = new Client({
    endPoint: config.minio.endpoint,
    port: config.minio.port,
    useSSL: config.minio.useSSL,
    accessKey: config.minio.accessKey,
    secretKey: config.minio.secretKey,
  });
}

export class StorageClient {
  static async getUrl(fileName: string) {
    if (config.storageMode === 'local') {
      return `http://localhost:${config.port}/storage/${fileName}`;
    }
    if (minioClient) {
      return await minioClient.presignedGetObject(config.minio.bucket, fileName, 24 * 60 * 60);
    }
    return '';
  }
}
