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

// ----------------------------------------------------------------------------------------------------------

// import CryptoJS from 'crypto-js';

// // Generate encryption key from user password using PBKDF2
// const generateEncryptionKey = (password, salt) => {
//     return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
//         keySize: 256 / 32,
//         iterations: 10000
//     });
// };

// // Encrypt a message
// export const encryptMessage = (message) => {
//     const password = localStorage.getItem("password");
//     if (!password) return null;

//     // Generate salt and IV
//     const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
//     const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes for AES-CBC

//     // Derive key
//     const key = generateEncryptionKey(password, salt);

//     // Encrypt with explicit IV
//     const encrypted = CryptoJS.AES.encrypt(message, key, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC
//     });

//     // Return format: salt + IV + ciphertext
//     return salt + iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Base64);
// };

// // Decrypt a message
// export const decryptMessage = (encryptedMessage) => {
//     const password = localStorage.getItem("password");
//     if (!password) return null;

//     // Extract components (32 chars salt + 32 chars IV + ciphertext)
//     const salt = encryptedMessage.slice(0, 32);
//     const ivHex = encryptedMessage.slice(32, 64);
//     const ciphertext = encryptedMessage.slice(64);

//     // Parse components
//     const iv = CryptoJS.enc.Hex.parse(ivHex);
//     const key = generateEncryptionKey(password, salt);

//     // Decrypt
//     const decrypted = CryptoJS.AES.decrypt({
//         ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
//     }, key, {
//         iv: iv,
//         mode: CryptoJS.mode.CBC
//     });

//     return decrypted.toString(CryptoJS.enc.Utf8);
// };

import CryptoJS from 'crypto-js';

// generate key
const generateEncryptionKey = (password, salt) => {
    // Salt must be parsed as Hex
    return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
        keySize: 256 / 32, // 256-bit key
        iterations: 10000,
    });
};

// encrypt message 
export const encryptMessage = (message) => {
    const password = localStorage.getItem("password");
    if (!password) return null;

    // Generate salt (16 bytes) and IV (16 bytes)
    const salt = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
    const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes for AES-CBC

    // Derive key using PBKDF2
    const key = generateEncryptionKey(password, salt);

    // Encrypt with explicit IV and CBC mode
    const encrypted = CryptoJS.AES.encrypt(message, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7 // Explicit padding
    });

    // Return format: HEX(salt) + HEX(iv) + BASE64(ciphertext)
    return salt + iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

// decrypt message
export const decryptMessage = (encryptedMessage) => {
    const password = localStorage.getItem("password");
    if (!password) return null;

    // Split into components
    const salt = encryptedMessage.substring(0, 32); // 32 hex chars = 16 bytes
    const ivHex = encryptedMessage.substring(32, 64); // Next 32 hex chars = 16 bytes IV
    const ciphertextB64 = encryptedMessage.substring(64); // Rest is Base64 ciphertext

    // Parse components
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Base64.parse(ciphertextB64);
    const key = generateEncryptionKey(password, salt);

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext }, // Formal CipherParams object
        key,
        { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
};