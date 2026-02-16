import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 chars
const IV_LENGTH = 16; // AES block size

// 🔒 Encrypts text (e.g., "HDFC0001234") -> "a1b2c3...:d4e5f6..."
export const encryptField = (text) => {
  if (!text) return text;
  // Generate a random initialization vector (IV) for every encryption
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // Return IV:EncryptedData so we can decrypt it later
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// 🔓 Decrypts text -> "HDFC0001234"
export const decryptField = (text) => {
  if (!text) return text;
  // Split the stored string into IV and Encrypted Data
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};