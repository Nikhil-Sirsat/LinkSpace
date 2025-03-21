import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import exp from 'constants';

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8'); // 32-byte key from .env
const IV_LENGTH = parseInt(process.env.IV_LENGTH); // Parse IV length (16 bytes)

// Encrypt function
export const encrypt = (text) => {
    const iv = crypto.randomBytes(IV_LENGTH); // Random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // Return IV + Encrypted text
}

// Decrypt function
export const decrypt = (encryptedText) => {
    const [iv, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        ENCRYPTION_KEY,
        Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
