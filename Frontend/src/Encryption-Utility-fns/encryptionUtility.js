import CryptoJS from 'crypto-js';

// Generate encryption key from user password using PBKDF2
const generateEncryptionKey = (password, salt) => {
    return CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32, // AES-256 needs 32 bytes
        iterations: 10000
    }).toString();
};

// Encrypt a message
export const encryptMessage = (message) => {
    const password = localStorage.getItem("password"); // Get user password
    console.log('enc pass : ', password);
    if (!password) {
        console.error("No password found for encryption!");
        return null;
    }

    const salt = CryptoJS.lib.WordArray.random(16).toString();
    const key = generateEncryptionKey(password, salt);
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();

    return salt + encrypted; // Store salt with the message
};

// Decrypt a message
export const decryptMessage = (encryptedMessage) => {
    const password = localStorage.getItem("password"); // Get user password
    console.log("dec pass : ", password);
    if (!password) {
        console.error("No password found for decryption!");
        return null;
    }

    const salt = encryptedMessage.slice(0, 32);
    const ciphertext = encryptedMessage.slice(32);
    const key = generateEncryptionKey(password, salt);
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);

    return bytes.toString(CryptoJS.enc.Utf8);
};

