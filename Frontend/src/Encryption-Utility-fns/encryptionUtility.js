import CryptoJS from 'crypto-js';

// Secret key (ensure this is securely shared)
const secretKey = import.meta.env.VITE_CRYPTO_SECRET_KEY; // 32-character key

// Encrypt a message
export const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
};

// Decrypt a message
export const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};
