import crypto from 'crypto';

// ⚠️ CRITICAL: Must be exactly 32 chars in .env
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || "PayNidhiSuperSecretKey1234567890").trim();
const IV_LENGTH = 16; // AES block size

// Safety Check
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.error("❌ FATAL ERROR: ENCRYPTION_KEY must be exactly 32 characters.");
  process.exit(1); 
}

// 🔒 Encrypt (Random IV -> Safe)
export const encryptField = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  } catch (error) {
    console.error("Encryption Failed:", error);
    return text;
  }
};

// 🔓 Decrypt
export const decryptField = (text) => {
  if (!text) return text;
  try {
    const textParts = text.split(':');
    if (textParts.length < 2) return text;
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    return text; 
  }
};

// 🔐 Hash (Deterministic -> Unique Check)
export const hashField = (text) => {
  if (!text) return text;
  return crypto
    .createHash("sha256")
    .update(text.toUpperCase().trim()) // Normalize input
    .digest("hex");
};
