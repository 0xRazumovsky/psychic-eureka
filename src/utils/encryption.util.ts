import * as crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const salt = Buffer.from(process.env.ENCRYPTION_SALT!, 'hex');
const key = crypto.scryptSync(process.env.ENCRYPTION_KEY!, salt, 32);

export function encryptMessage(message: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(message, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptMessage(encrypted: string): string {
  const [ivHex, authTagHex, encryptedHex] = encrypted.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encryptedText = Buffer.from(encryptedHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, undefined, 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
}
