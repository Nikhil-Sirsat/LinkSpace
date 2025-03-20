// import CryptoJS from 'crypto-js';

// // Generate encryption key from user password using PBKDF2
// const generateEncryptionKey = (password, salt) => {
//     return CryptoJS.PBKDF2(password, salt, {
//         keySize: 256 / 32, // AES-256 needs 32 bytes
//         iterations: 10000
//     }).toString();
// };

// // Encrypt a message
// export const encryptMessage = (message) => {
//     const password = localStorage.getItem("password"); // Get user password

//     console.log('enc pass : ', password);

//     if (!password) {
//         console.error("No password found for encryption!");
//         return null;
//     }

//     const salt = CryptoJS.lib.WordArray.random(16).toString();
//     console.log('salt : ', salt);
//     const key = generateEncryptionKey(password, salt);
//     console.log('key : ', key);
//     const encrypted = CryptoJS.AES.encrypt(message, key).toString();
//     console.log('encrypted : ', encrypted);

//     console.log('salt + encrypted : ', salt + encrypted);
//     return salt + encrypted; // Store salt with the message
// };

// // Decrypt a message
// export const decryptMessage = (encryptedMessage) => {
//     const password = localStorage.getItem("password"); // Get user password

//     console.log('dec pass : ', password);

//     if (!password) {
//         console.error("No password found for decryption!");
//         return null;
//     }

//     const salt = encryptedMessage.slice(0, 32);
//     console.log('salt : ', salt);
//     const ciphertext = encryptedMessage.slice(32);
//     console.log('ciphertext : ', ciphertext);
//     const key = generateEncryptionKey(password, salt);
//     console.log('key : ', key);
//     const bytes = CryptoJS.AES.decrypt(ciphertext, key);
//     console.log('bytes : ', bytes);

//     console.log('final return : ', bytes.toString(CryptoJS.enc.Utf8))
//     return bytes.toString(CryptoJS.enc.Utf8);
// };

import CryptoJS from 'crypto-js';

// Generate encryption key from user password using PBKDF2
const generateEncryptionKey = (password, salt) => {
    return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), { // Parse salt as Hex
        keySize: 256 / 32,
        iterations: 10000
    }); // Keep as WordArray
};

// Encrypt a message
export const encryptMessage = (message) => {
    const password = localStorage.getItem("password");
    console.log('enc pass:', password);

    if (!password) return null;

    // Generate 16-byte salt (32 hex characters)
    const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    console.log('salt:', salt);

    // Generate key (WordArray)
    const key = generateEncryptionKey(password, salt);
    console.log('key:', key.toString(CryptoJS.enc.Hex)); // Log hex representation

    // Encrypt with DIRECT KEY (no passphrase handling)
    const encrypted = CryptoJS.AES.encrypt(message, key, {
        mode: CryptoJS.mode.CBC // Explicit mode helps compatibility
    }).toString();
    console.log('encrypted:', encrypted);

    return salt + encrypted;
};

// Decrypt a message
export const decryptMessage = (encryptedMessage) => {
    const password = localStorage.getItem("password");
    console.log('dec pass:', password);

    if (!password) return null;

    // Extract salt (32 hex chars) and ciphertext
    const salt = encryptedMessage.slice(0, 32);
    const ciphertext = encryptedMessage.slice(32);
    console.log('salt:', salt, 'ciphertext:', ciphertext);

    // Generate key (WordArray)
    const key = generateEncryptionKey(password, salt);
    console.log('key:', key.toString(CryptoJS.enc.Hex));

    // Decrypt with raw key
    const bytes = CryptoJS.AES.decrypt(ciphertext, key, {
        mode: CryptoJS.mode.CBC // Must match encryption mode
    });
    console.log('bytes:', bytes);

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    console.log('final return:', decrypted);
    return decrypted;
};