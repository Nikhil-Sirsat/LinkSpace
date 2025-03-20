import CryptoJS from 'crypto-js';

// Generate encryption key from user password using PBKDF2
const generateEncryptionKey = (password, salt) => {
    return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
        keySize: 256 / 32, // AES-256 needs 32 bytes
        iterations: 10000
    });
};

// Encrypt a message
export const encryptMessage = (message) => {
    const password = localStorage.getItem("password");
    console.log('enc pass : ', password);
    if (!password) {
        console.error("No password found for encryption!");
        return null;
    }

    const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    console.log('salt : ', salt);
    const key = generateEncryptionKey(password, salt);
    console.log('key : ', key);
    const encrypted = CryptoJS.AES.encrypt(message, key).toString();
    console.log('encrypted: ', encrypted);
    console.log('salt + encrypted : ', salt + encrypted);
    return salt + encrypted;

};

// Decrypt a message
export const decryptMessage = (encryptedMessage) => {
    const password = localStorage.getItem("password");
    console.log('dec pass : ', password);
    if (!password) {
        console.error("No password found for decryption!");
        return null;
    }

    const salt = encryptedMessage.slice(0, 32);
    console.log('salt : ', salt);
    const ciphertext = encryptedMessage.slice(32);
    console.log('cipherText : ', ciphertext);

    try {
        const key = generateEncryptionKey(password, salt);
        console.log('key : ', key);
        const bytes = CryptoJS.AES.decrypt(ciphertext, key); // Removed format option
        console.log('bytes : ', bytes);
        const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
        console.log('decrypted message : ', decryptedMessage);

        if (!decryptedMessage) {
            throw new Error("Decryption failed! Incorrect key or corrupted data.");
        }

        return decryptedMessage;
    } catch (error) {
        console.error("Error decrypting message:", error);
        return null;
    }
};