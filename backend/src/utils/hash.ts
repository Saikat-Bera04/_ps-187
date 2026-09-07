import crypto from 'crypto';
import fs from 'fs';

/**
 * Calculate SHA-256 hash of a buffer or string.
 */
export function calculateSHA256(data: Buffer | string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Calculate SHA-256 hash of a file by path.
 */
export function calculateFileSHA256(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * Verify a SHA-256 hash against data.
 */
export function verifySHA256(data: Buffer | string, expectedHash: string): boolean {
  const actualHash = calculateSHA256(data);
  return actualHash === expectedHash;
}
