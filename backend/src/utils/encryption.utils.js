import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes
const IV_LENGTH = 16; // AES block size

// 🔒 Encrypt (AES-256-CBC)
export const encryptField = (text) => {
  if (!text) return text;

  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// 🔓 Decrypt
export const decryptField = (text) => {
  if (!text) return text;

  const textParts = text.split(":");
  const iv = Buffer.from(textParts.shift(), "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

// 🔐 Deterministic hash (for duplicate check)
export const hashField = (text) => {
  if (!text) return text;

  return crypto
    .createHash("sha256")
    .update(text.toUpperCase().trim())
    .digest("hex");
};
