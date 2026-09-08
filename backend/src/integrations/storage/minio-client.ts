import { Client } from 'minio';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../../config';
import { calculateSHA256 } from '../../utils/hash';

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
  private static getLocalPath(filePath: string) {
    const storageRoot = path.resolve(config.localStoragePath);
    const target = path.resolve(storageRoot, filePath);
    if (target !== storageRoot && !target.startsWith(`${storageRoot}${path.sep}`)) {
      throw new Error('Invalid evidence storage path');
    }
    return { storageRoot, target };
  }

  static async storeSnapshot(evidenceCode: string, content: Buffer, mimeType: 'image/jpeg' | 'image/png') {
    const extension = mimeType === 'image/png' ? 'png' : 'jpg';
    const filePath = `evidence/${evidenceCode}.${extension}`;
    const hash = calculateSHA256(content);

    if (config.storageMode === 'local') {
      const { target } = this.getLocalPath(filePath);
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, content);
    } else if (minioClient) {
      const exists = await minioClient.bucketExists(config.minio.bucket);
      if (!exists) await minioClient.makeBucket(config.minio.bucket);
      await minioClient.putObject(config.minio.bucket, filePath, content, content.length, { 'Content-Type': mimeType });
    } else {
      throw new Error('Evidence storage is not configured');
    }

    return { filePath, hash, fileSizeKB: Math.max(1, Math.ceil(content.length / 1024)) };
  }

  static async read(filePath: string): Promise<Buffer> {
    if (config.storageMode === 'local') {
      const { target } = this.getLocalPath(filePath);
      return fs.readFile(target);
    }

    if (!minioClient) throw new Error('Evidence storage is not configured');
    const stream = await minioClient.getObject(config.minio.bucket, filePath);
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  static async remove(filePath: string) {
    if (config.storageMode === 'local') {
      const { target } = this.getLocalPath(filePath);
      await fs.rm(target, { force: true });
      return;
    }
    if (minioClient) await minioClient.removeObject(config.minio.bucket, filePath);
  }

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
