import CryptoJS from 'crypto-js';
const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY;

// Encrypt a message
export const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
}

// Decrypt a message
export const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};